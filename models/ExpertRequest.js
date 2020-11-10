const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExpertRequestSchema = new Schema({
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
    refPath : "expert_type"
  },
  expert_type: {
    type: String,
    required: true,
    enum: ["Company", "Expert"],
  },
 
  is_company: {
    type: Boolean,
    required: [true, "Please validate whether expert or company"],
  },
  price: {
    type: Number,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: "Price must be greater than 0",
    },
    required : [true,"Please enter a price for your offer"]
  },

  pending_work_id : {
    type: mongoose.Schema.ObjectId,
    ref: "PendingWork",
  },
  is_accepted: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
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

module.exports = mongoose.model("ExpertRequest", ExpertRequestSchema);
