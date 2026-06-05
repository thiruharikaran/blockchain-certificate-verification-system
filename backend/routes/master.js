const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const MasterAdmin = require("../models/MasterAdmin");
const College = require("../models/College");
const CollegeAdmin = require("../models/CollegeAdmin");
const User = require("../models/User");
const Certificate = require("../models/Certificate");
const Verification = require("../models/Verification");

const router = express.Router();

/////////////////////////////////////////////////////
// MASTER ADMIN LOGIN
/////////////////////////////////////////////////////

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await MasterAdmin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "MASTER_ADMIN"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
  success: true,
  token,
  role: "MASTER_ADMIN",
  name: admin.name,
  email: admin.email
});

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

/////////////////////////////////////////////////////
// ANALYTICS
/////////////////////////////////////////////////////

router.get(
  "/analytics",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {

      const colleges = await College.countDocuments();
const students = await User.countDocuments({ role: "STUDENT" });
const recruiters = await User.countDocuments({ role: "RECRUITER" });
const certificates = await Certificate.countDocuments();
const verifications = await Verification.countDocuments();
const collegeAdmins = await CollegeAdmin.countDocuments();

      res.json({
  success: true,
  data: {
    colleges,
    students,
    recruiters,
    certificates,
    verifications,
    collegeAdmins
  }
});

    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Analytics failed"
      });
    }
  }
);

/////////////////////////////////////////////////////
// STUDENTS
/////////////////////////////////////////////////////

// GET ALL STUDENTS
router.get(
  "/students",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    const students = await User.find({ role: "STUDENT" })
      .select("-password");

    res.json({
      success: true,
      students
    });
  }
);

// DELETE STUDENT
router.delete(
  "/students/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted"
    });
  }
);

/////////////////////////////////////////////////////
// ADD STUDENT
/////////////////////////////////////////////////////

router.post(
  "/students",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const { name, email, password, collegeId } = req.body;

      // check existing
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Student already exists"
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const student = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        collegeId
      });

      res.json({
        success: true,
        student
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to add student"
      });
    }

  }
);

/////////////////////////////////////////////////////
// UPDATE STUDENT
/////////////////////////////////////////////////////

router.put(
  "/students/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const { name, email, collegeId } = req.body;

      const student = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          collegeId
        },
        { new: true }
      );

      res.json({
        success: true,
        student
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,
        message: "Failed to update student"
      });

    }

  }
);


/////////////////////////////////////////////////////
// RECRUITERS CRUD
/////////////////////////////////////////////////////

// GET ALL RECRUITERS
router.get(
  "/recruiters",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {

      const recruiters = await User.find({
        role: "RECRUITER"
      }).select("-password");

      res.json({
        success: true,
        recruiters
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch recruiters"
      });
    }
  }
);

/////////////////////////////////////////////////////
// DELETE COLLEGE ADMIN
/////////////////////////////////////////////////////

router.delete(
  "/college-admins/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      await CollegeAdmin.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "College admin deleted"
      });

    } catch (err) {

      console.error("DELETE COLLEGE ADMIN ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to delete college admin"
      });

    }

  }
);

/////////////////////////////////////////////////////
// UPDATE COLLEGE ADMIN
/////////////////////////////////////////////////////

router.put(
  "/college-admins/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const { name, collegeName, email, password } = req.body;

      const updateData = {
        collegeName,
        email
      };

      // Update password only if provided
      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const admin = await CollegeAdmin.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        success: true,
        admin
      });

    } catch (err) {

      console.error("UPDATE COLLEGE ADMIN ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to update college admin"
      });

    }

  }
);

/////////////////////////////////////////////////////
// CREATE COLLEGE ADMIN
/////////////////////////////////////////////////////

router.post(
  "/college-admins",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const { name, collegeName, email, password } = req.body;

      const existing = await CollegeAdmin.findOne({ email });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "College admin already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await CollegeAdmin.create({
        name,
        collegeName,
        email,
        password: hashedPassword
      });

      res.json({
        success: true,
        admin
      });

    } catch (err) {

      console.error("CREATE COLLEGE ADMIN ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to create college admin"
      });

    }

  }
);

/////////////////////////////////////////////////////
// GET ALL COLLEGE ADMINS
/////////////////////////////////////////////////////

router.get(
  "/college-admins",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const admins = await CollegeAdmin.find();

      res.json({
        success: true,
        admins
      });

    } catch (err) {

      console.error("FETCH COLLEGE ADMINS ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to fetch college admins"
      });

    }

  }
);

// ADD RECRUITER
router.post(
  "/recruiters",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {

      const { name, email, password, companyName } = req.body;

      // check existing recruiter
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Recruiter already exists"
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create recruiter
      const recruiter = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "RECRUITER",
  companyName
});

      res.json({
        success: true,
        recruiter
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to create recruiter"
      });
    }
  }
);


// UPDATE RECRUITER
router.put(
  "/recruiters/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {

      const { name, email, password } = req.body;

      const updateData = {
        name,
        email
      };

      // update password only if provided
      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const recruiter = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        recruiter
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to update recruiter"
      });
    }
  }
);


// DELETE RECRUITER
router.delete(
  "/recruiters/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {
    try {

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Recruiter deleted successfully"
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to delete recruiter"
      });
    }
  }
);

/////////////////////////////////////////////////////
// COLLEGES
/////////////////////////////////////////////////////

// GET ALL COLLEGES
router.get(
  "/colleges",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    const colleges = await College.find();

    res.json({
      success: true,
      colleges
    });
  }
);

// ADD COLLEGE
router.post(
  "/colleges",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    const college = await College.create(req.body);

    res.json({
      success: true,
      college
    });
  }
);

// UPDATE COLLEGE
router.put(
  "/colleges/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      college
    });
  }
);

// DELETE COLLEGE
router.delete(
  "/colleges/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    await College.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "College deleted"
    });
  }
);

/////////////////////////////////////////////////////
// CERTIFICATES
/////////////////////////////////////////////////////

// GET ALL CERTIFICATES (FULL PROFESSIONAL)
router.get(
  "/certificates",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const certificates = await Certificate.find()
        .populate("studentId", "name email") // ✅ student info
        .sort({ uploadedAt: -1 });           // ✅ latest first

      res.json({
        success: true,
        certificates
      });

    }
    catch (err) {

      console.error("FETCH CERTIFICATES ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to fetch certificates"
      });

    }

  }
);


// UPDATE CERTIFICATE NAME
router.put(
  "/certificates/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const { certificateName } = req.body;

      const cert = await Certificate.findByIdAndUpdate(
        req.params.id,
        { certificateName },
        { new: true }
      );

      res.json({
        success: true,
        certificate: cert
      });

    }
    catch (err) {

      console.error("UPDATE CERT ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to update certificate"
      });

    }

  }
);


// DELETE CERTIFICATE
router.delete(
  "/certificates/:id",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      await Certificate.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Certificate deleted"
      });

    }
    catch (err) {

      console.error("DELETE CERT ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to delete certificate"
      });

    }

  }
);

/////////////////////////////////////////////////////
// GET ALL VERIFICATIONS (MASTER ADMIN)
/////////////////////////////////////////////////////

router.get(
  "/verifications",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const verifications = await Verification.find()

        .populate("studentId", "name email")

        .populate("recruiterId", "name email companyName")

        .populate(
          "certificateId",
          "certificateName certificateHash fileName uploadedAt"
        )

        .sort({ createdAt: -1 });

      res.json({
        success: true,
        verifications
      });

    }
    catch (err) {

      console.error("MASTER VERIFICATIONS ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Failed to fetch verifications"
      });

    }

  }
);

/////////////////////////////////////////////////////
// RECENT ACTIVITY
/////////////////////////////////////////////////////

router.get(
  "/recent-activity",
  verifyToken,
  allowRoles("MASTER_ADMIN"),
  async (req, res) => {

    try {

      const activity = await Verification.find()
  .populate("studentId", "name")
  .populate("recruiterId", "name companyName")
  .populate("certificateId", "certificateName")
  
  .sort({ createdAt: -1 })
  .limit(5);

      res.json({
        success: true,
        activity
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,
        message: "Failed to load activity"
      });

    }

  }
);



/////////////////////////////////////////////////////

module.exports = router;
