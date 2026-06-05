const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  collegeName: String,
  collegeCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("College", collegeSchema);
