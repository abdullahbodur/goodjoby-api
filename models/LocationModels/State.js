const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StateSchema = new Schema({
  // post_code: {
  //   type: Number,
  //   required: [true, "Please provide a Post Code for State"],
  // },
  city_id: {
    type: mongoose.Schema.ObjectId,
    ref: "State",
    required: [true, "Please provide a city_id for State"],
  },

  name: {
    tr: {
      type: String,
      required: [true, "Please provide a name for State"],
    },
  },

  clients: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
      unique: [true, "You are already registered in this State"],
    },
  ],
  experts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Expert",
      unique: [true, "You are already registered in this State"],
    },
  ],

  teams: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      unique: [true, "You are already registered in this State"],
    },
  ],
});

module.exports = mongoose.model("State", StateSchema);
