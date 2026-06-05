const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({

  //////////////////////////////////////////////////////
  // RELATIONS
  //////////////////////////////////////////////////////

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Certificate",
    required: true
  },

  //////////////////////////////////////////////////////
  // CERTIFICATE INFO
  //////////////////////////////////////////////////////

  certificateName: {
    type: String,
    required: true
  },

  certificateHash: {
    type: String,
    required: true
  },

  //////////////////////////////////////////////////////
  // RECRUITER INFO
  //////////////////////////////////////////////////////

  recruiterCompany: {
    type: String,
    required: true
  },

  //////////////////////////////////////////////////////
  // RESULT
  //////////////////////////////////////////////////////

  result: {
    type: String,
    enum: ["VALID", "INVALID"],
    required: true
  },

  //////////////////////////////////////////////////////
  // DATE
  //////////////////////////////////////////////////////

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Verification", verificationSchema);