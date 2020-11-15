const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobAnnouncementSchema = new Schema({
  content: {
    type: String,
    maxlength: [150, "Content must be 150 character or fewer"],
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: [true, "Please provide a company"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  job_applications: [
    {
      applicaton_id: { type: mongoose.Schema.ObjectId, ref: "JobApplication" },
      expert_id: { type: mongoose.Schema.ObjectId, ref: "Expert" },
    },
  ],

  state: {
    type: Number,
    required: [true, "Please provide a state"],
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: "State index must be greater and equal than 0",
    },
    default: 0,
  },

  price: {
    type: Number,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: "Price must be greater than 0",
    },
  },

  aim_job: {
    type: mongoose.Schema.ObjectId,
    ref: "JobInfo",
  },

  expireDate: {
    type: Date,
    required: [true, "Please provide a last date for your announcement"],
  },
  accepted_expert: {
    type: mongoose.Schema.ObjectId,
    ref: "Exper",
  },
  is_accepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("JobAnnouncement", JobAnnouncementSchema);
