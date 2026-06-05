const express = require("express");
const multer = require("multer");
const Certificate = require("../models/Certificate");
const hashFile = require("../utils/hashFile");

const verifyToken = require("../middleware/authMiddleware"); 
const { ethers } = require("ethers");
const ABI = require("../blockchain/CertificateVerification.json").abi;


const router = express.Router();

////////////////////////////////////////////////////////
// MULTER STORAGE CONFIG
////////////////////////////////////////////////////////

const storage = multer.diskStorage({

  destination: "uploads/",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }

});

const upload = multer({ storage });

////////////////////////////////////////////////////////
// ISSUE CERTIFICATE
// POST /api/certificate/issue
////////////////////////////////////////////////////////

router.post("/issue", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { studentId, certificateName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File required",
      });
    }

    ////////////////////////////////////////////////////////
    // Generate hash
    ////////////////////////////////////////////////////////

    const filePath = req.file.path;
    let certificateHash;

    try {
      certificateHash = await hashFile(filePath);
      console.log("✅ HASH:", certificateHash);
    } catch (err) {
      console.error("❌ HASH ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Hash generation failed",
      });
    }

////////////////////////////////////////////////////////
// STORE HASH ON BLOCKCHAIN (SEPOLIA)
////////////////////////////////////////////////////////

try {

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
  );

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    ABI,
    wallet
  );

  console.log("🚀 Storing on blockchain...");

  const tx = await contract.addCertificate(certificateHash);

  console.log("⏳ Waiting for confirmation...");

  await tx.wait();

  console.log("✅ Stored on blockchain");

}
catch (err) {

  console.error("❌ Blockchain store error:", err);

}
    ////////////////////////////////////////////////////////
    // 🚨 DUPLICATE CHECK (IMPORTANT FIX)
    ////////////////////////////////////////////////////////

    const existing = await Certificate.findOne({ certificateHash });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Certificate already exists (duplicate file)",
      });
    }

    ////////////////////////////////////////////////////////
    // Save to MongoDB
    ////////////////////////////////////////////////////////

    let certificate;

    try {
      certificate = await Certificate.create({
        studentId,
        certificateName,
        certificateHash,
        fileName: req.file.filename,
        uploadedBy: req.user.id,
      });

      console.log("✅ DB SAVED");
    } catch (err) {
      console.error("❌ DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database save failed",
      });
    }

    ////////////////////////////////////////////////////////

    res.json({
      success: true,
      certificateHash: certificate.certificateHash,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Certificate issue failed",
    });
  }
});

////////////////////////////////////////////////////////
// GET ALL CERTIFICATES
////////////////////////////////////////////////////////

router.get("/", async (req, res) => {

  try {

    const certificates = await Certificate.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      certificates
    });

  }
  catch (err) {

    res.status(500).json({

      success: false
    });

  }

});

////////////////////////////////////////////////////////
// DELETE CERTIFICATE
////////////////////////////////////////////////////////

router.delete("/:id", async (req, res) => {

  try {

    await Certificate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Certificate deleted"
    });

  }
  catch (err) {

    res.status(500).json({
      success: false
    });

  }

});

////////////////////////////////////////////////////////

module.exports = router;