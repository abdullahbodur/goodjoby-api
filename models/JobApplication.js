const mongoose = require("mongoose");
const CustomError = require("../helpers/error/CustomError");
const JobAnnouncement = require("./JobAnnouncement");
const errorHandlerWrapper = require("express-async-handler");
const e = require("express");

const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
  title: {
    type: String,
    maxlength: [80, "Title must be 80 character or fewer"],
  },
  content: {
    type: String,
    maxlength: [150, "Content must be 150 character or fewer"],
  },
  expert: {
    type: mongoose.Schema.ObjectId,
    ref: "Expert",
  }, 
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: [true, "Please provide a company"],
  },

  job_announcement_id: {
    type: mongoose.Schema.ObjectId,
    ref: "JobAnnouncement",
  },

  documents: [
    {
      document_url: String,
      document_name: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  interviewDate: {
    type: Date,
  },

  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
  ],

  price: {
    type: Number,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: "Price must be greater than 0",
    },
  },

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

  is_accepted: {
    type: Boolean,
    default: false,
  },
});

JobApplicationSchema.pre("save", async function (next) {
  if (!this.isModified("expert")) return next();

  try {
    const jobAnnouncement = await JobAnnouncement.findById(
      this.job_announcement_id
    );

    if (!jobAnnouncement) {
      throw new CustomError("There is no Job Announcement with that id", 400);
    }
    
    if(jobAnnouncement.job_applications.some(e => e.expert_id.toString() === this.expert.toString()))
      throw new CustomError("You are already applied this Announcement", 400);


    jobAnnouncement.job_applications.push({
      applicaton_id: this._id,
      expert_id: this.expert,
    });

    await jobAnnouncement.save();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
