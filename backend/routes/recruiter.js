const express = require("express");
const multer = require("multer");
const Certificate = require("../models/Certificate");

const hashFile = require("../utils/hashFile");
const verifyBlockchain = require("../utils/verifyBlockchain");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware"); 

const router = express.Router();

//////////////////////////////////////////////////
// Multer config
//////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

//////////////////////////////////////////////////
// Recruiter Login
//////////////////////////////////////////////////

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const recruiter = await User.findOne({
      email,
      role: "RECRUITER"
    });

    if (!recruiter) {
      return res.status(400).json({
        success: false,
        message: "Recruiter not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      recruiter.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: recruiter._id,
        role: "RECRUITER"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  success: true,
  token,
  role: "RECRUITER",
  name: recruiter.name,
  email: recruiter.email,
  companyName: recruiter.companyName
});

  }
  catch (err) {

    console.error("Recruiter login error:", err);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });

  }

});

//////////////////////////////////////////////////
// Verify Certificate File
//////////////////////////////////////////////////



router.post(
  "/verify-file",
  verifyToken,
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      const filePath = req.file.path;

      //////////////////////////////////////////////////
      // Generate hash
      //////////////////////////////////////////////////

      const fileHash = await hashFile(filePath);
      console.log("VERIFY HASH:", fileHash);

      //////////////////////////////////////////////////
      // Check DB
      //////////////////////////////////////////////////

      const cert = await Certificate.findOne({
  certificateHash: fileHash
}).populate("studentId", "name email");

if (!cert) {
  return res.json({
    success: false,
    message: "❌ Certificate not found in database",
    hash: fileHash
  });
}

      let dbStatus = false;
      let blockchainStatus = false;

      if (cert) dbStatus = true;

      //////////////////////////////////////////////////
      // Check Blockchain
      //////////////////////////////////////////////////

      blockchainStatus = await verifyBlockchain(fileHash);

console.log("BLOCKCHAIN RESULT:", blockchainStatus);

      //////////////////////////////////////////////////
      // Final decision
      //////////////////////////////////////////////////

      const isValid = dbStatus && blockchainStatus;

     //////////////////////////////////////////////////
// SAVE VERIFICATION RECORD (FIXED VERSION)
//////////////////////////////////////////////////

const Verification = require("../models/Verification");

// Save verification record
await Verification.create({

  studentId: cert.studentId._id,

  recruiterId: req.user.id,

  certificateId: cert._id,

  certificateName: cert.certificateName,

  certificateHash: fileHash,

  recruiterCompany: req.user.companyName || "Unknown Company",

  result: isValid ? "VALID" : "INVALID",

  createdAt: new Date()

});
      //////////////////////////////////////////////////
      // Response if INVALID
      //////////////////////////////////////////////////

      if (!isValid) {

        return res.json({
          success: false,
          message: "❌ Certificate NOT valid",
          hash: fileHash,
          dbStatus,
          blockchainStatus
        });

      }

      //////////////////////////////////////////////////
      // Response if VALID
      //////////////////////////////////////////////////

      res.json({
  success: true,
  message: "✅ Certificate is AUTHENTIC",

  hash: fileHash,

  transactionHash: cert.transactionHash,

  recruiterCompany: req.user.companyName,

  certificate: {
    name: cert.certificateName,
    studentName: cert.studentId.name,
    studentEmail: cert.studentId.email,

    hash: fileHash,

    uploadedAt: cert.uploadedAt,

    fileUrl: cert.certificateUrl,

    transactionHash: cert.transactionHash
  }
});

    }
    catch (err) {

      console.error("Verify error:", err);

      res.status(500).json({
        success: false,
        message: "Verification failed"
      });

    }

  }
);

//////////////////////////////////////////////////

module.exports = router;