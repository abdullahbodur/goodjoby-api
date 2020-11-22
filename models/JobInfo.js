const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Sector = require("../models/Sector");
const CustomError = require("../helpers/error/CustomError");

const JobInfoSchema = new Schema({
  job_name: {
    type: String,
    required: [true, "Please provide a job name"],
    unique: [true, "This JobName is created before"],
  },

  job_tags: [
    { type: String, unique: [true, "This Job-Tag is created before"] },
  ],
  job_slogan: {
    type: String,
    maxlength: [80, "Slogan must be 80 characters or fewer"],
  },

  question_filters: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "QuestionFilter",
    },
  ],

  deal_count: {
    type: Number,
    default: 0,
  },

  teams: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
    },
  ],

  sector_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Sector",
  },

  experts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Expert",
    },
  ],

  worker_count: {
    type: Number,
    default: 0,
  },
  team_count: {
    type: Number,
    default: 0,
  },
});

JobInfoSchema.pre("save", async function (next) {
  if (!this.isModified("sector_id")) return next();

  try {
    const sector = await Sector.findById(this.sector_id);

    if (!sector) {
      throw new CustomError("There is no sector with that id", 400);
    }

    sector.subJobs.push(this._id);

    await sector.save();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("JobInfo", JobInfoSchema);
