const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkSchema = new Schema({
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
  finished_percent: {
    type: Number,
    default: 0,
  },
  service_id: {
    type: mongoose.Schema.ObjectId,
    ref: "JobInfo",
  },
  expert: {
    type: mongoose.Schema.ObjectId,
    refPath : "expert_type"
  },
  expert_type: {
    type: String,
    required: true,
    enum: ["Company", "Expert"],
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

  is_company: {
    type: Boolean,
    required: [true, "Please validate whether expert or company"],
  },
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
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: "State index must be greater and equal than 0",
    },
    default: 0,
  },

  rates: [
    {
      name: {
        type: String,
      },
      rate: {
        type: Number,
      },
    },
  ],

  comment: {
    type: String,
    maxlength: [200, "Comment must be 200 character or fewer"],
  },

  cancel_token: {
    type: String,
  },
  cancel_token_expire: {
    type: Date,
  },

  finish_token : {
    type: String,
  },
  finish_token_expire : {
    type: Date,
  }
});

module.exports = mongoose.model("Work", WorkSchema);
