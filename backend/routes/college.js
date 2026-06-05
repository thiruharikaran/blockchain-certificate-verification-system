const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { ethers } = require("ethers");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const College = require("../models/College");
const CollegeAdmin = require("../models/CollegeAdmin");
const User = require("../models/User");
const Certificate = require("../models/Certificate");

const hashFile = require("../utils/hashFile");

const router = express.Router();

/* ================================
   📁 MULTER CONFIG (PDF UPLOAD)
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================================
   🏫 CREATE COLLEGE (MASTER ADMIN)
================================ */
router.post(
  "/create-college",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {
      const { collegeName, collegeCode } = req.body;
      const college = await College.create({ collegeName, collegeCode });
      res.json({ success: true, college });
    } catch (err) {
      console.error("CREATE COLLEGE ERROR:", err);
      res.status(500).json({ message: "Failed to create college" });
    }
  }
);

/* ================================
   👑 CREATE COLLEGE ADMIN (MASTER)
================================ */
router.post(
  "/create-admin",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {
      const { collegeName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await CollegeAdmin.create({
        collegeName,
        email,
        password: hashedPassword
      });

      res.json({ success: true, admin });
    } catch (err) {
      console.error("CREATE ADMIN ERROR:", err);
      res.status(500).json({ message: "Failed to create admin" });
    }
  }
);

/* ================================
   🔐 COLLEGE ADMIN LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await CollegeAdmin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Find REAL college by name
    const college = await College.findOne({ collegeName: admin.collegeName });

    if (!college) {
      return res.status(400).json({ message: "College not found for this admin" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "COLLEGE_ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  success: true,
  token,
  role: "COLLEGE_ADMIN",
  name: admin.name,
  email: admin.email,
  collegeId: college._id
});

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});


/* ================================
   🎓 ADD STUDENT (COLLEGE ADMIN)
================================ */
router.post(
  "/add-student",
  verifyToken,
  allowRoles("COLLEGE_ADMIN"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Student already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await CollegeAdmin.findById(req.user.id);

// Find the college that this admin belongs to
const college = await College.findOne({ collegeName: admin.collegeName });

if (!college) {
  return res.status(400).json({ message: "College not found for this admin" });
}

const student = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "STUDENT",
  collegeId: college._id   // ✅ REAL ObjectId
});


      res.json({ success: true, student });
    } catch (err) {
      console.error("ADD STUDENT ERROR:", err);
      res.status(500).json({ message: "Failed to add student" });
    }
  }
);

/* ================================
   📋 LIST STUDENTS
================================ */
router.get(
  "/students/:collegeId",
  verifyToken,
  allowRoles("MASTER_ADMIN", "COLLEGE_ADMIN"),
  async (req, res) => {
    try {
      const students = await User.find(
        { role: "STUDENT", collegeId: req.params.collegeId },
        "-password -__v"
      );
      res.json(students);
    } catch (err) {
      console.error("LIST STUDENTS ERROR:", err);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  }
);

/**
 * UPLOAD CERTIFICATE (COLLEGE ADMIN)
 * PDF → HASH → DB → BLOCKCHAIN
 */
router.post(
  "/upload-certificate",
  verifyToken,
  allowRoles("COLLEGE_ADMIN"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { studentId, certificateName } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // 1️⃣ Generate hash from PDF
      const fileHash = await hashFile(req.file.path);
// 2️⃣ CHECK if certificate already exists
const existing = await Certificate.findOne({
  certificateHash: fileHash
});

if (existing) {
  return res.status(400).json({
    success: false,
    message: "⚠️ Certificate already uploaded",
    existing
  });
}

      // 2️⃣ Save to MongoDB (THIS WILL ALWAYS WORK)
      const cert = await Certificate.create({
        studentId,
        certificateName,
        certificateHash: fileHash,
        uploadedBy: req.user.id,
        fileName: req.file.filename
      });

      console.log("✅ Saved to MongoDB:", cert);

      // 3️⃣ TRY Blockchain — but DON'T crash if it fails
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

        const wallet = new ethers.Wallet(
          process.env.PRIVATE_KEY,
          provider
        );

        const contractJSON = require(
          "../../blockchain/artifacts/contracts/CertificateVerification.sol/CertificateVerification.json"
        );

        const contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          contractJSON.abi,
          wallet
        );

        const tx = await contract.addCertificate(fileHash);
        await tx.wait();

        console.log("✅ Stored on Blockchain");

      } catch (blockchainError) {
        console.error("⚠️ Blockchain FAILED (but DB succeeded):", blockchainError);
      }

      res.json({
        success: true,
        message: "✅ Certificate saved (Blockchain attempted)",
        hash: fileHash,
        cert
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Certificate upload failed" });
    }
  }
);

/* ================================
   📄 LIST CERTIFICATES (COLLEGE ADMIN)
================================ */
router.get(
  "/certificates",
  verifyToken,
  allowRoles("COLLEGE_ADMIN"),
  async (req, res) => {
    try {

      const certificates = await Certificate
        .find({ uploadedBy: req.user.id })
        .populate("studentId", "name email");

      res.json(certificates);

    } catch (err) {

      console.error("FETCH CERTIFICATES ERROR:", err);
      res.status(500).json({ message: "Failed to fetch certificates" });

    }
  }
);

/* ================================
   ❌ DELETE CERTIFICATE (COLLEGE ADMIN)
================================ */
router.delete(
  "/delete-certificate/:id",
  verifyToken,
  allowRoles("COLLEGE_ADMIN"),
  async (req, res) => {
    try {

      const cert = await Certificate.findById(req.params.id);

      if (!cert) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found"
        });
      }

      // extra security: ensure admin deletes only their own certificate
      if (cert.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      await Certificate.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Certificate deleted"
      });

    } catch (err) {

      console.error("DELETE CERTIFICATE ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Delete failed"
      });

    }
  }
);


module.exports = router;
