const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CountriesSchema = new Schema({
  country_code: {
    type: Number,
    required: [true, "Please give a Country Code for Country"],
  },

  name: {
    tr: {
      type: String,
      required: [true, "Please provide a name for Country"],
    },
  },
  cities: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "City",
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

module.exports = mongoose.model("Country", CountriesSchema);
