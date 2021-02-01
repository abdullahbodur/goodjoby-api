const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
  plate_id: {
    type: String,
    required: [true, "Please give a plate Id for City"],
  },
  country_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Country",
    required: [true, "Please give a Country Id for City"],
  },

  name: {
    tr: {
      type: String,
      required: [true, "Please provide a name for City"],
    },
  },
  states: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "State",
    },
  ],
  // clients: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Client",
  //   },
  // ],
  // experts: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Expert",
  //   },
  // ],

  // teams: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Team",
  //   },
  // ],
});

module.exports = mongoose.model("City", CitiesSchema);
