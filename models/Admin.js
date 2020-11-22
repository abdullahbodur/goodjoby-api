const mongoose = require("mongoose");
const { hashPassword } = require("../helpers/modelHelpers/modelHelper");
const {
  getResetPasswordTokenFromUser,
} = require("../helpers/modelHelpers/modelHelper");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
      "Password must includes symbol,number,capital",
    ],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  role: {
    type: String,
    default: "admin",
    enum: ["client", "exper", "team", "admin"],
  },
  stage: {
    type: Number,
    enum: [0, 1, 2, 3, 4], // standart admin
    required: [true, "Please provide a stage"],
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    unique: [true, "This token already taken"],
  },
  tokenExpire: {
    type: Date,
  },
});

AdminSchema.methods.getTokenFromUser = function () {
  return getResetPasswordTokenFromUser(this);
};

AdminSchema.pre("save", function (next) {
  hashPassword(next, this);
});

module.exports = mongoose.model("Admin", AdminSchema);
