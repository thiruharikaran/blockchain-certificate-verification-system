const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const User = require("../models/User");
const Certificate = require("../models/Certificate");

const router = express.Router();


// =====================================
// ✅ STUDENT LOGIN
// POST /api/student/login
// =====================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await User.findOne({
      email,
      role: "STUDENT"
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student not found"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: "STUDENT"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      role: "STUDENT",
      name: student.name,
      email: student.email
    });

  } catch (err) {
    console.error("STUDENT LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});


// =====================================
// GET Student Certificates
// =====================================
router.get(
  "/certificates",
  verifyToken,
  allowRoles("STUDENT"),
  async (req, res) => {
    try {
      const certs = await Certificate.find({
        studentId: req.user.id
      }).sort({ uploadedAt: -1 });

      res.json({
        success: true,
        certificates: certs
      });

    } catch (err) {
      console.error("FETCH CERT ERROR:", err);
      res.status(500).json({
        message: "Failed to fetch certificates"
      });
    }
  }
);

/////////////////////////////////////////////////////////
// GET VERIFICATIONS FOR A CERTIFICATE (STUDENT)
/////////////////////////////////////////////////////////

const Verification = require("../models/Verification");

router.get(
  "/certificate-verifications/:certificateId",
  verifyToken,
  allowRoles("STUDENT"),
  async (req, res) => {

    try {

      const verifications = await Verification.find({
        certificateId: req.params.certificateId
      })
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });

      res.json({
        success: true,
        verifications
      });

    }
    catch (err) {

      console.error(err);

      res.status(500).json({
        success:false,
        message:"Failed to fetch verifications"
      });

    }

  }
);

module.exports = router;
