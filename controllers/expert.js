const errorHandlerWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const Expert = require("../models/Expert");
const JobAnnouncement = require("../models/JobAnnouncement");
const JobApplication = require("../models/JobApplication");
const PendingWork = require("../models/PendingWork");

// const crypting = require("./crypting");

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const registerExpert = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const signExpert = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const logoutExpert = (req, res, next) => {
  const { NODE_ENV } = process.env;
  res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now),
      secure: NODE_ENV === "development" ? false : true, // https koruması
    })
    .json({
      success: true,
      message: "Logout is succesfully",
    });
};

// == == == == == == == == == == == == == == == == == == == ==
//  PROFILE EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const profileExpert = (req, res, next) => {
  res.status(200).json({
    profileOwnerAccess: req.profileOwnerAccess,
    profile: req.profile,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const forgotPasswordExpert = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Password reset link is sended your email",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const resetPassword = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "password is updated",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL EXPERTS CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const getAllExpert = errorHandlerWrapper(async (req, res, next) => {
  const experts = await Expert.find({});

  res.status(200).json({
    success: true,
    experts: experts,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const uploadedPIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Company profile image uploaded successfuly",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const uploadedBIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Company background image uploaded successfuly",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const createnewApplication = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;

  const jobApplication = await JobApplication.create({
    ...data,
    expert: req.user.id,
    job_announcement_id: id,
  });

  res.status(200).json({
    success: true,
    data: jobApplication.documents,
    app_id: jobApplication._id,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD DOCUMENTS TO SERVER FOR JOB APPLICATION
// == == == == == == == == == == == == == == == == == == == ==

const uploadNewDocuments = errorHandlerWrapper(async (req, res, next) => {
  const { id } = req.params;

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return next(
      new CustomError("There is no Job Application with that id", 400)
    );
  }

  const documents = jobApplication.documents;

  for (let i = 0; i < documents.length; i++) {
    documents[i]["document_url"] = req.files[i]["file_url"];
  }

  jobApplication.documents = documents;

  await jobApplication.save();

  res.status(200).json({
    success: true,
    message: "Document uploaded successfuly",
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  ADD NEW JOB - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const addNewJobs = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;
  const expert = req.user.userObject;

  expert.job = data;

  await expert.save();

  res.status(200).json({
    success: true,
    message: "You added Positions Successfuly",
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET SEARCH SUB JOB FOR ADD - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const getSearchSubJob = (req, res, next) => {
  res.status(200).json(res.result);
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL PROPERY WORKS
// == == == == == == == == == == == == == == == == == == == ==

const getAllPropWorks = (req, res, next) => {
  res.status(200).json({ success: true, data: req.propWorks });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE EXPERT REQUEST
// == == == == == == == == == == == == == == == == == == == ==
 
const createExpertRequest = (req, res, next) => {
  res.status(200).json({ success: true, expertRequest: req.expertRequest });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE EXPERT REQUEST
// == == == == == == == == == == == == == == == == == == == ==

const cancelExpertRequest = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are successfuly canceled your offer",
  });
};


// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK REQUEST - CLIENT
// == == == == == == == == == == == == == == == == == == == ==


const cancelWork = (req, res, next) => {
  res.status(200).json({
    success: true,
    message : "Cancelling request successfuly, Please wait your expert response"
  });
};


// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - CLIENT
// == == == == == == == == == == == == == == == == == == == ==


const cancelWorkAccept = (req,res,next)=>{
  res.status(200).json({
    success: true,
    message: "You are successfuly canceled work",
  });
}

module.exports = {
  profileExpert,
  logoutExpert,
  registerExpert,
  signExpert,
  resetPassword,
  forgotPasswordExpert,
  getAllExpert,
  uploadedPIController,
  uploadedBIController,
  uploadNewDocuments,
  createnewApplication,
  addNewJobs,
  getSearchSubJob,
  getAllPropWorks,
  createExpertRequest,
  cancelExpertRequest,
  cancelWorkAccept,
  cancelWork
};
