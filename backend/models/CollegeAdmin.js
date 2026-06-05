const mongoose = require("mongoose");

const collegeAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("CollegeAdmin", collegeAdminSchema);