const errorHandlerWrapper = require("express-async-handler");
const Company = require("../models/Company");
const JobAnouncement = require("../models/JobAnnouncement");
const CustomError = require("../helpers/error/CustomError");
const JobApplication = require("../models/JobApplication");
const JobAnnouncement = require("../models/JobAnnouncement");
const { application } = require("express");

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER COMPANY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const registerCompany = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN COMPANY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const signCompany = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT COMPANY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const logoutCompany = (req, res, next) => {
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
//  PROFILE COMPANY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const profileCompany = (req, res, next) => {
  res.status(200).json({
    profileOwnerAccess: req.profileOwnerAccess,
    profile: req.profile,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD COMPANY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const forgotPasswordCompany = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Password reset link is sended your email",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD COMPANY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const resetPassword = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "password is updated",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const getAllCompany = errorHandlerWrapper(async (req, res, next) => {
  const companies = await Company.find({});

  res.status(200).json({
    success: true,
    companies: companies,
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
//  CREATE JOB ANOUNCEMENT FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const createJobAnouncement = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;

  const newAnouncement = await JobAnouncement.create({
    ...data,
    expireDate: new Date(Date.now() + parseInt(data["expireDate"])),
    company: req.user.id,
  });

  const company = req.user.userObject;

  company.job_announcements.push(newAnouncement);

  await company.save();

  res.status(200).json({
    success: true,
    company: company,
    anouncement: newAnouncement,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL JOB ANOUNCEMENT FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const getAllJobAnouncement = errorHandlerWrapper(async (req, res, next) => {
  const id = req.user.id;

  const job_announcements = await JobAnouncement.find({ company: id });

  res.status(200).json({
    success: true,
    data: job_announcements,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  DATE FOR INTERVIEW FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const dateForInterview = errorHandlerWrapper(async (req, res, next) => {
  const { interview_date, application_id } = req.body;

  const jobApplication = await JobApplication.findById(application_id);

  if (!jobApplication) {
    return next(
      new CustomError("There is no Job Application with that id", 400)
    );
  }

  jobApplication.interviewDate = new Date(
    Date.now() + parseInt(interview_date)
  );
  await jobApplication.save();

  res.status(200).json({
    success: true,
    message: "Date for Interview successfuly",
    date: jobApplication.interviewDate,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  ACCEPT JOB APPLICATION FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const acceptJobApplication = errorHandlerWrapper(async (req, res, next) => {
  const { application_id } = req.body;
  const { announcement_id } = req.params;

  const announcement = await JobAnnouncement.findById(announcement_id);

  if (!announcement) {
    return next(
      new CustomError("There is no Job Announcement with that id", 400)
    );
  }

  const jobApplication = await JobApplication.findById(application_id);

  if (!jobApplication) {
    return next(
      new CustomError("There is no Job Application with that id", 400)
    );
  }

  // ADD EXPERT TO YOUR WORKERS LIST

  try {
    announcement.accepted_expert = jobApplication.expert;
    announcement.is_accepted = true;
    announcement.state = parseInt(process.env.STATE_FINISHED);
    jobApplication.is_accepted = true;

    await announcement.save();
    await jobApplication.save();
  } catch (error) {
    announcement.accepted_expert = undefined;
    announcement.is_accepted = false;
    announcement.state = parseInt(process.env.STATE_ACTIVE);
    jobApplication.is_accepted = false;

    await announcement.save();
    await jobApplication.save();

    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Accepted successfuly",
  }); 
});

// == == == == == == == == == == == == == == == == == == == ==
//  ADD NEW JOBS - COMPANY
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
//  GET SEARCH SUBJOB FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const getSearchSubJob = (req, res, next) => {
  res.status(200).json(res.result);
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL PROPERY WORKS
// == == == == == == == == == == == == == == == == == == == ==

const getAllPropWorks = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.propWorks });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE EXPERT REQUEST
// == == == == == == == == == == == == == == == == == == == ==

const createExpertRequest = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json({ success: true, expertRequest: req.expertRequest });
});

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
//  CANCEL WORK ACCEPT - COMPANY
// == == == == == == == == == == == == == == == == == == == ==


const cancelWorkAccept = (req,res,next)=>{
  res.status(200).json({
    success: true,
    message: "You are successfuly canceled work",
  });
}


// == == == == == == == == == == == == == == == == == == == ==
//  UPGRADE FINISHED PERCENT - COMPANY
// == == == == == == == == == == == == == == == == == == == ==


const upgradeFinishedPercent = (req,res,next)=>{
  res.status(200).json({
    success: true,
    message: "You are upgraded finished percent successfuly",
    data : req.work
  });
}





module.exports = {
  registerCompany,
  signCompany,
  logoutCompany,
  profileCompany,
  forgotPasswordCompany,
  resetPassword,
  getAllCompany,
  uploadedPIController,
  uploadedBIController,
  createJobAnouncement,
  getAllJobAnouncement,
  dateForInterview,
  acceptJobApplication,
  addNewJobs,
  getSearchSubJob,
  getAllPropWorks,
  createExpertRequest,
  cancelWork,
  cancelWorkAccept,
  upgradeFinishedPercent
};
