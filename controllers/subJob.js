const errorHandlerWrapper = require("express-async-handler");
const CustomError = require('../helpers/error/CustomError');
const JobInfo = require("../models/JobInfo");
const QuestionFilter = require('../models/QuestionFilter');

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE SUBJOB
// == == == == == == == == == == == == == == == == == == == ==
 
const createSubJob = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;

  const subJob = await JobInfo.create(data);

  res.status(200).json({
    success: true,
    data: subJob,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL SUBJOBS
// == == == == == == == == == == == == == == == == == == == ==

const getAllSubJob = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json(res.result);
});



const createQuestionFilter = errorHandlerWrapper(async(req,res,next)=>{

const serviceID = req.params.service_id; 
const data = req.body;

const jobInfo = await JobInfo.findById(serviceID);

if(!jobInfo){
  return next(new CustomError("There is no service with that id",400))
}

const questionFilter = await QuestionFilter.create(data);

jobInfo.question_filters.push(questionFilter._id);

await jobInfo.save();

res.status(200).json({
  success : true,
  message: "Question Created Successfuly",
  data : questionFilter
})
})

module.exports = {
  createSubJob,
  getAllSubJob,
  createQuestionFilter
};
