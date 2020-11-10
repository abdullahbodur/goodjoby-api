const express = require("express");
const router = express.Router();
const {
  createNewSector,
  addSubJobs,
  getAllSectors,
} = require("../controllers/sector");

const sectorQueryMiddlware = require("../middlewares/query/queryMiddleware");
const Sector = require("../models/Sector");

// == == == == == == == == == == == == == == == == == == == ==
//  GET REQUESTS
// == == == == == == == == == == == == == == == == == == == ==
 
router.post("/create", createNewSector);

router.get(
  "/all",
  [
    sectorQueryMiddlware(Sector, "sector_name", {
      population: {
        path: "subJobs",
        select: "job_names",
      },
    }),
  ],
  getAllSectors
);

// == == == == == == == == == == == == == == == == == == == ==
//  POST REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.post("/:id/addsubjob", addSubJobs);

module.exports = router;
