const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  certificateName: {
    type: String,
    required: true
  },

  certificateHash: {
  type: String,
  required: true,
  unique: true,
  index: true 
},

  uploadedBy: {
    type: String, 
    required: true
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  },
  fileName: {
  type: String,
  required: true
}

});

module.exports = mongoose.model("Certificate", certificateSchema);
