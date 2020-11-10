const express = require("express");
const router = express.Router();
const company = require("./company");
const sector = require("./sector");
const client = require("./client");
const expert = require("./expert");
const subJob = require("./subJob");
const admin = require("./admin");

router.get("/", (req, res, next) => {
  res.send("<h1>Welcome Api Page</h1>");
});
 
router.use("/client", client);
router.use("/expert", expert);
router.use("/company", company);
router.use("/sector", sector);
router.use("/subjob", subJob);
router.use("/admin", admin);

module.exports = router;
