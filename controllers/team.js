const errorHandlerWrapper = require("express-async-handler");
const Team = require("../models/Team");
const JobAnouncement = require("../models/JobAnnouncement");
const CustomError = require("../helpers/error/CustomError");
const JobApplication = require("../models/JobApplication");
const JobAnnouncement = require("../models/JobAnnouncement");
const { application } = require("express");
const { dataControl } = require("../helpers/database/databaseControl");
const { populate } = require("../models/Team");
const sendMail = require("../helpers/libraries/sendMail");

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER TEAM CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const registerTeam = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN TEAM CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const signTeam = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT TEAM CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const logoutTeam = (req, res, next) => {
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
//  PROFILE TEAM CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const profileTeam = (req, res, next) => {
  res.status(200).json({
    profileOwnerAccess: req.profileOwnerAccess,
    profile: req.profile,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD TEAM CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const forgotPasswordTeam = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Password reset link is sended your email",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD TEAM CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const resetPassword = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "password is updated",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL TEAM
// == == == == == == == == == == == == == == == == == == == ==

const getAllTeam = errorHandlerWrapper(async (req, res, next) => {
  const teams = await Team.find({});

  res.status(200).json({
    success: true,
    teams: teams,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadedPIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Team profile image uploaded successfuly",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadedBIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Team background image uploaded successfuly",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE JOB ANOUNCEMENT FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const createJobAnouncement = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;

  const newAnouncement = await JobAnouncement.create({
    ...data,
    expireDate: new Date(Date.now() + parseInt(data["expireDate"])),
    team: req.user.client_id,
  });

  const team = req.user.userObject;

  team.job_announcements.push(newAnouncement);

  await team.save();

  res.status(200).json({
    success: true,
    team: team,
    anouncement: newAnouncement,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL JOB ANOUNCEMENT FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const getAllJobAnouncement = errorHandlerWrapper(async (req, res, next) => {
  const id = req.user.client_id;

  const job_announcements = await JobAnouncement.find({ team: id });

  res.status(200).json({
    success: true,
    data: job_announcements,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  DATE FOR INTERVIEW FOR TEAM
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
//  ACCEPT JOB APPLICATION FOR TEAM
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
//  ADD NEW JOBS - TEAM
// == == == == == == == == == == == == == == == == == == == ==

const addNewJobs = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You added Positions Successfuly",
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET SEARCH SUBJOB FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const getSearchSubJob = (req, res, next) => {
  res.status(200).json(res.result);
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL PROPERY WORKS
// == == == == == == == == == == == == == == == == == == == ==

const getAllPropWorks = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.propWorks,
    positionStatus: req.positionStatus,
  });
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
    message: "Cancelling request successfuly, Please wait your expert response",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - TEAM
// == == == == == == == == == == == == == == == == == == == ==

const cancelWorkAccept = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are successfuly canceled work",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPGRADE FINISHED PERCENT - TEAM
// == == == == == == == == == == == == == == == == == == == ==

const upgradeFinishedPercent = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are upgraded finished percent successfuly",
    data: req.work,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL JOB ANNOUNCEMENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelJobAnnouncement = async (req, res, next) => {
  const { announcement_id } = req.body;
  const { STATE_ACTIVE, STATE_CREATED, STATE_CANCELED } = process.env;
  dataControl(announcement_id, next, "Please provide an Announcement ID", 400);

  const jobAnouncement = await JobAnnouncement.findOne({
    _id: announcement_id,
    is_accepted: false,
    state: { $in: [parseInt(STATE_ACTIVE), parseInt(STATE_CREATED)] },
    expireDate: { $gt: Date.now() },
  })
    .select({
      job_applications: 1,
    })
    .populate([
      {
        path: "job_applications",
        select: "_id ",
        populate: [
          {
            path: "expert_id",
            select: "name email",
          },
          {
            path: "applicaton_id",
            select: "state",
          },
        ],
      },
    ]);

  dataControl(jobAnouncement, next, "Job Announcement could not find", 400);

  const defState = jobAnouncement.state;

  try {
    jobAnouncement.state = parseInt(STATE_CANCELED);
    await jobAnouncement.save();

    if (jobAnouncement.job_applications.length > 0) {
      let applicationMailList = [];

      jobAnouncement.job_applications.forEach((jobApplication) => {
        if (!stateControl(jobApplication.applicaton_id.state))
          applicationMailList.push(job_applications.expert_id.email);
      });

      await sendMail({
        from: process.env.SMTP_USER,
        to: applicationMailList,
        subject: "Your Applied Job Announcement Canceled By Team",
        html: cancelJobAnnouncement(announcement_id),
      });
    }
  } catch (error) {
    jobAnouncement.state = defState;
    await jobAnouncement.save();
    return next(error);
  }
  res
    .status(200)
    .json({ success: true, message: "Announcement canceled successfuly" });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL EXPERT REQUEST
// == == == == == == == == == == == == == == == == == == == ==

const cancelExpertRequest = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are successfuly canceled your offer",
  });
};

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
//  ACCEPTING VERIFICATE CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const acceptingVerificationController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Your account verification is successfuly",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const updateLocationController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Your location is updated successfuly",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER PROFILE
// == == == == == == == == == == == == == == == == == == == ==

const registerProfile = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Register profile is saved",
  });
};

module.exports = {
  registerTeam,
  signTeam,
  logoutTeam,
  profileTeam,
  forgotPasswordTeam,
  resetPassword,
  getAllTeam,
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
  upgradeFinishedPercent,
  cancelJobAnnouncement,
  cancelExpertRequest,
  verificationSendController,
  acceptingVerificationController,
  updateLocationController,
  registerProfile,
};
