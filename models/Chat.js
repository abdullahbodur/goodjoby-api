const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatShema = new Schema({
  room_ssid: {
    type: String,
    required: [true, "Please provide a room_ssid"],
    unique: [true, "There is another room with that ssid"],
  },

  messages: [
    {
      from: {
        type: mongoose.Schema.ObjectId,
        refPath: "from_path",
      },
      to: {
        type: mongoose.Schema.ObjectId,
        refPath: "to_path",
      },
      from_path: {
        type: String,
        required: [true, "Please provide a fromPath"],
        enum: ["Team", "Expert", "Client"],
      },
      to_path: {
        type: String,
        required: [true, "Please provide a toPath"],
        enum: ["Team", "Expert", "Client"],
      },
      message: {
        type: String,
        required: [true, "Please provide a message"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  documents: [
    {
      document_url: String,
      document_name: String,
    },
  ],

  users: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        refPath: "user_path",
      },
      user_path: {
        type: String,
        required: [true, "Please provide a fromPath"],
        enum: ["Team", "Expert", "Client"],
      },
    },
  ],
});

module.exports = mongoose.model("Chat", ChatShema);
