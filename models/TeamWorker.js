const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeamWorkerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },

  job: {
    sector_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Sector",
    },
    positions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "JobInfo",
      },
    ],
  },

  profile_image: {
    type: String,
    default: "defualtProfile.png",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Job
  worker: {
    type: mongoose.Schema.ObjectId,
    ref: "Expert",
  },
});

module.exports = mongoose.model("TeamWorker", TeamWorkerSchema);
