const express = require("express");

const College = require("../models/College");
const User = require("../models/User");
const Certificate = require("../models/Certificate");
const Verification = require("../models/Verification");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * =====================================
 * ADMIN ANALYTICS (MASTER ADMIN ONLY)
 * GET /api/admin/analytics
 * =====================================
 */
router.get(
  "/analytics",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {
      const totalColleges = await College.countDocuments();
      const totalStudents = await User.countDocuments({ role: "STUDENT" });
      const totalRecruiters = await User.countDocuments({ role: "RECRUITER" });
      const totalCertificates = await Certificate.countDocuments();
      const totalVerifications = await Verification.countDocuments();

      res.json({
        success: true,
        stats: {
          totalColleges,
          totalStudents,
          totalRecruiters,
          totalCertificates,
          totalVerifications
        }
      });
    } catch (err) {
      console.error("ANALYTICS ERROR 👉", err);
      res.status(500).json({ message: "Failed to load analytics" });
    }
  }
);

module.exports = router;
