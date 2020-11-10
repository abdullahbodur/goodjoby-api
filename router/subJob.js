const express = require("express");
const router = express.Router();
const { tokenControl } = require("../middlewares/tokenControls/tokenControls");
const { createSubJob, getAllSubJob,createQuestionFilter } = require("../controllers/subJob");
const queryMiddleware = require("../middlewares/query/queryMiddleware");
const JobInfo = require("../models/JobInfo");

router.post("/create", createSubJob);

router.get(
  "/all",
  [queryMiddleware(JobInfo, "job_tags", undefined, { job_name: 1 })],
  getAllSubJob
);
 

router.post("/create_question_filter/:service_id",createQuestionFilter)




module.exports = router;
