require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/**
 * Middlewares
 */
app.use(
  cors({
  origin: [
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app"
  ],
  credentials: true,
})
);
app.use(express.json());

/**
 * MongoDB connection
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

/**
 * Routes
 */
app.use("/api/master", require("./routes/master"));
app.use("/api/college", require("./routes/college"));
app.use("/api/verification", require("./routes/verification"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/student", require("./routes/student"));
app.use("/api/admin", require("./routes/adminAnalytics"));
app.use("/api/certificate", require("./routes/certificate"));

/**
 * Static files
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Start server
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VeriQore Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});
