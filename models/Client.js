const mongoose = require("mongoose");
const { hashPassword } = require("../helpers/modelHelpers/modelHelper");
const {
  getResetPasswordTokenFromUser,
} = require("../helpers/modelHelpers/modelHelper");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide an username for account"],
    unique: [true, "This username is already taken"],
    lowercase: true,
    match: [
      /^[a-zA-Z0-9]+$/,
      "Username must includes number (0-9), capital (A-Z), lower (a-z)",
    ],
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "This email is used before"],
    lowercase: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Email type is not supported",
    ],
  },
  password: {
    type: String,
    // required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
      "Password must includes symbol,number,capital",
    ],
    select: false,
  },
  google_id: {
    type: String,
    unique: [
      true,
      "This Google Account was used by one. Please try another one",
    ],
  },

  facebook_id: {
    type: String,
    unique: [
      true,
      "This Facebook Account was used by one. Please try another one",
    ],
  },
  profile_image: {
    type: String,
    default: "defualtProfile.png",
  },
  background_image: {
    type: String,
    default: "defaultBackground.png",
  },
  bio: {
    type: String,
    maxlength: [150, "Bio must be 150 character or fewer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "client",
    enum: ["client", "exper", "team", "admin"],
  },
  token: {
    type: String,
    unique: [true, "This token already taken"],
  },
  tokenExpire: {
    type: Date,
  },

  works: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Work",
    },
  ],

  pending_works: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "PendingWork",
    },
  ],

  blocked: {
    type: Boolean,
    default: false,
  },
});

ClientSchema.methods.getTokenFromUser = function () {
  return getResetPasswordTokenFromUser(this);
};

ClientSchema.pre("save", function (next) {
  hashPassword(next, this);
});

module.exports = mongoose.model("Client", ClientSchema);
