const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const Verification = require("../models/Verification");

const router = express.Router();

/////////////////////////////////////////////////////////
// GET ALL VERIFICATIONS (MASTER ADMIN)
/////////////////////////////////////////////////////////

router.get(
  "/",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const verifications = await Verification.find()

        // populate certificate info
        .populate({
          path: "certificateId",
          select: "certificateName certificateHash fileName certificateUrl uploadedAt",
          populate: {
            path: "studentId",
            select: "name email"
          }
        })

       

        .sort({ createdAt: -1 });


      res.json({
        success: true,
        verifications
      });

    }
    catch (err) {

      console.error("FETCH VERIFICATIONS ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to fetch verifications"
      });

    }

  }
);

/////////////////////////////////////////////////////////
// DELETE VERIFICATION (OPTIONAL)
/////////////////////////////////////////////////////////

router.delete(
  "/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      await Verification.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Verification deleted"
      });

    }
    catch (err) {

      console.error("DELETE VERIFICATION ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to delete verification"
      });

    }

  }
);

module.exports = router;