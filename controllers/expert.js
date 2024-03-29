const errorHandlerWrapper = require("express-async-handler");
const { dataControl } = require("../helpers/database/databaseControl");
const CustomError = require("../helpers/error/CustomError");
const Expert = require("../models/Expert");
const JobAnnouncement = require("../models/JobAnnouncement");
const JobApplication = require("../models/JobApplication");
const JobInfo = require("../models/JobInfo");
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
      message: "Logout is successfully",
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
//  UPLOAD PROFILE IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadedPIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Team profile image uploaded successfully",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadedBIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Team background image uploaded successfully",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const createnewApplication = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;

  const jobApplication = await JobApplication.create({
    ...data,
    expert: req.user.client_id,
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
    message: "Document uploaded successfully",
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  ADD NEW JOB - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const addNewJobs = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You added Positions Successfully",
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
    message: "You are successfully canceled your offer",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK REQUEST - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWork = (req, res, next) => {
  res.status(200).json({
    success: true,
    message:
      "Cancelling request successfully, Please wait your expert response",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWorkAccept = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are successfully canceled work",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL PROP JOB ANNOUNCEMENTS
// == == == == == == == == == == == == == == == == == == == ==

const getAllPropJobAnnouncements = async (req, res, next) => {
  const user = req.user.userObject;
  const { STATE_CREATED, STATE_ACTIVE } = process.env;

  const jobAnnouncements = await JobAnnouncement.find({
    aim_job: { $in: user.job.positions },
    expireDate: { $gt: Date.now() },
    state: { $in: [parseInt(STATE_CREATED), parseInt(STATE_ACTIVE)] },
    is_accepted: false,
  })
    .select({
      state: 0,
      is_accepted: 0,
      job_applications: 0,
      __v: 0,
    })
    .populate([
      {
        path: "aim_job",
        select: "job_name",
      },
      {
        path: "team",
        select: "name",
      },
    ]);

  res.status(200).json({
    jobAnnouncements: jobAnnouncements,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL JOB APPLICATION
// == == == == == == == == == == == == == == == == == == == ==

const cancelJobApplication = errorHandlerWrapper(async (req, res, next) => {
  const { application_id } = req.body;
  const { STATE_ACTIVE, STATE_CREATED, STATE_CANCELED } = process.env;
  dataControl(application_id, next, "Please provide an Application ID", 400);

  const jobApplication = await JobApplication.findOne({
    _id: application_id,
    expert: req.user.userObject._id,
    state: { $in: [parseInt(STATE_CREATED), parseInt(STATE_ACTIVE)] },
  }).select({ _id: 1, state: 1 });

  dataControl(jobApplication, next, "Job Application is not found", 400);

  jobApplication.state = parseInt(STATE_CANCELED);
  await jobApplication.save();

  res.status(200).json({
    success: true,
    message: "Job Application canceled successfully",
    data: jobApplication,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  SENDING VERIFICATE CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationSendController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Email sended your mail. Please check your Inbox",
    email: req.user.email,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const updateLocationController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Your location is updated successfully",
  });
};

// // == == == == == == == == == == == == == == == == == == == ==
// //  REGISTER PROFILE
// // == == == == == == == == == == == == == == == == == == == ==

// const registerProfile = (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     message: "Register profile is saved",
//   });
// };

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
  cancelWork,
  getAllPropJobAnnouncements,
  cancelJobApplication,
  verificationSendController,
  updateLocationController,
};
