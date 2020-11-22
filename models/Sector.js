const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SectorSchema = new Schema({
  sector_name: {
    type: String,
    required: [true, "Please provide a sector name"],
    unique: [true, "This sector is created before"],
  },

  subJobs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "JobInfo",
    },
  ],

  teams: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
  },
  workers: {
    type: mongoose.Schema.ObjectId,
    ref: "Expert",
  },
});

module.exports = mongoose.model("Sector", SectorSchema);
