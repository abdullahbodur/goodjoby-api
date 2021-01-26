const mongoose = require("mongoose");
const { hashPassword } = require("../helpers/modelHelpers/modelHelper");
const Schema = mongoose.Schema;
const {
  getResetPasswordTokenFromUser,
} = require("../helpers/modelHelpers/modelHelper");

const ExpertSchema = new Schema({
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

  completed_works_count: {
    type: Number,
    default: 0,
  },

  team_id: { type: mongoose.Schema.ObjectId, ref: "Team" },

  role: {
    type: String,
    default: "expert",
    enum: ["client", "expert", "team", "admin"],
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

  offers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ExpertRequest",
    },
  ],

  applications: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "JobApplication",
    },
  ],
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

  blocked: {
    type: Boolean,
    default: false,
  },
});

ExpertSchema.methods.getTokenFromUser = function () {
  return getResetPasswordTokenFromUser(this);
};

ExpertSchema.pre("save", function (next) {
  hashPassword(next, this);
});

module.exports = mongoose.model("Expert", ExpertSchema);
