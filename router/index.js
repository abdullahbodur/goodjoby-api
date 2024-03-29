const express = require("express");
const router = express.Router();
const team = require("./team");
const sector = require("./sector");
const client = require("./client");
const expert = require("./expert");
const subJob = require("./subJob");
const admin = require("./admin");
const location = require("./location");

router.get("/", (req, res, next) => {
  res.send("<h1>Welcome Api Page</h1>");
});

router.use("/client", client);
router.use("/expert", expert);
router.use("/team", team);
router.use("/sector", sector);
router.use("/subjob", subJob);
router.use("/admin", admin);
router.use("/location", location);

module.exports = router;
