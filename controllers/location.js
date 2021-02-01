const Country = require("../models/LocationModels/Country");
const City = require("../models/LocationModels/City");
const State = require("../models/LocationModels/State");
const errorHandlerWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const { default: fetch } = require("node-fetch");
const { count } = require("../models/LocationModels/Country");
const { ignoreSelectGenerator } = require("../helpers/inputHelper/inputHelper");

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE COUNTRY
// == == == == == == == == == == == == == == == == == == == ==

const createCountry = errorHandlerWrapper(async (req, res, next) => {
  const body = req.body;

  if (!body)
    return next(
      new CustomError("Please enter some information for new Country", 400)
    );

  const country = await Country.create(body);

  res.status(200).json({
    success: true,
    message: "Country is created successfuly",
    data: country,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE CITY
// == == == == == == == == == == == == == == == == == == == ==

const createCity = errorHandlerWrapper(async (req, res, next) => {
  const body = req.body;

  if (!body)
    return next(
      new CustomError("Please enter some information for new City", 400)
    );

  const city = await City.create(body);

  res.status(200).json({
    success: true,
    message: "City is created successfuly",
    data: city,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE STATE
// == == == == == == == == == == == == == == == == == == == ==

const createState = errorHandlerWrapper(async (req, res, next) => {
  const body = req.body;

  if (!body)
    return next(
      new CustomError("Please enter some information for new State", 400)
    );

  const state = await State.create(body);

  res.status(200).json({
    success: true,
    message: "State is created successfuly",
    data: state,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD LOCATION DATABASE
// == == == == == == == == == == == == == == == == == == == ==

const uploadLocationDatabase = errorHandlerWrapper(async (req, res, next) => {
  const response = await fetch(
    "https://www.senerov.com/projects/tr-il-ilce/js/il-ilce.json?_=1612211533260"
  );

  const country_data = {
    country_code: 90,
    name: {
      tr: "Türkiye",
    },
  };

  const json = await response.json();

  const data = json.data;

  const country = await Country.create(country_data);

  for (const cityInformation of data) {
    const city_data = {
      plate_id: cityInformation.plaka_kodu,
      country_id: country._id,
      name: { tr: cityInformation.il_adi },
    };

    const city = await City.create(city_data);

    country.cities.push(city._id);

    await country.save();

    for (const stateInformation of cityInformation.ilceler) {
      const state_data = {
        city_id: city._id,
        name: { tr: stateInformation.ilce_adi },
      };

      const state = await State.create(state_data);

      city.states.push(state._id);

      await city.save();
    }
  }
  res
    .status(200)
    .json({ success: true, message: "Uploaded Location Database" });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET COUNTRIES
// == == == == == == == == == == == == == == == == == == == ==

const getCountries = errorHandlerWrapper(async (req, res, next) => {
  const countries = await Country.find();

  res.status(200).json({
    success: true,
    message: "Countries is loaded successfuly",
    data: countries,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET CITIES
// == == == == == == == == == == == == == == == == == == == ==

const getCities = errorHandlerWrapper(async (req, res, next) => {
  const { id } = req.params;

  const { ignore } = req.query;

  const select = ignoreSelectGenerator(ignore);

  if (!id) return next(new CustomError("Please provide an Id for Cities", 400));

  const cities = await City.find({ country_id: id }).select(select);

  if (cities.length === 0)
    return next(new CustomError("This country Id is invalid", 400));

  res.status(200).json({
    success: true,
    message: "Cities is loaded successfuly",
    data: cities,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET STATES
// == == == == == == == == == == == == == == == == == == == ==

const getStates = errorHandlerWrapper(async (req, res, next) => {
  const { id } = req.params;

  const { ignore } = req.query;

  if (!id) return next(new CustomError("Please provide an Id for States", 400));

  const select = ignoreSelectGenerator(ignore);

  const states = await State.find({ city_id: id }).select(select);

  if (states.length === 0)
    return next(new CustomError("This country Id is invalid", 400));

  res.status(200).json({
    success: true,
    message: "States is loaded successfuly",
    data: states,
  });
});

module.exports = {
  createCountry,
  createCity,
  createState,
  uploadLocationDatabase,
  getCountries,
  getCities,
  getStates,
};
