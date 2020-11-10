const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PendingWorkSchema = new Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: [true, "Please provide a client"],
  },

  description: {
    type: String,
    maxlength: [150, "Description must be 150 characters or fewer"],
  },
  documents: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
  expireAt: {
    type: Date,
  },
  service_id: {
    type: mongoose.Schema.ObjectId,
    ref: "JobInfo",
  },

  expert_requests: [{ type: mongoose.Schema.ObjectId, ref: "ExpertRequest" }],
  
  answers: [
    {
      type: Number,
      required: [true, "Please provide some answers for your work"],
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Answer index must be greater and equal than 0",
      },
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



});

module.exports = mongoose.model("PendingWork", PendingWorkSchema);
