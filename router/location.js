const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const {
  createCountry,
  createCity,
  createState,
  uploadLocationDatabase,
  getCountries,
  getCities,
  getStates,
} = require("../controllers/location");
const {
  adminStageControl,
  adminTokenControl,
  blockedControl,
} = require("../middlewares/tokenControls/tokenControls");

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** POST REQUESTS ******** POST REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE A NEW COUNTRY
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * country_code
//    * country_name in lanugages
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_country",
  [adminTokenControl, adminStageControl([4]), blockedControl(Admin)],
  createCountry
);

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE A NEW CİTY
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * plate_id
//    * country_id
//    * name
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_city",
  [adminTokenControl, adminStageControl([4]), blockedControl(Admin)],
  createCity
);

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE A NEW STATE
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * post_code
//    * city_id
//    * name
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_state",
  [adminTokenControl, adminStageControl([4]), blockedControl(Admin)],
  createState
);

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD LOCATION DATABASE
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * post_code
//    * city_id
//    * name
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/upload_location",
  [adminTokenControl, adminStageControl([4]), blockedControl(Admin)],
  uploadLocationDatabase
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET COUNTRIES
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//   * none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/countries", getCountries);

// == == == == == == == == == == == == == == == == == == == ==
//  GET CITIES
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//   * id
// == == == == == == == == == == == == == == == == == == == ==

router.get("/cities/:id", getCities);

// == == == == == == == == == == == == == == == == == == == ==
//  GET STATES
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//   * id
// == == == == == == == == == == == == == == == == == == == ==

router.get("/states/:id", getStates);
module.exports = router;
