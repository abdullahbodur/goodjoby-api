const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/team");

const {
  teamRegister,
  teamSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
  socialSignInUpController,
} = require("../helpers/Auth/teamAuthHelper");

const {
  tokenControl,
  profileTokenControl,
  tokenRoleControl,
  blockedControl,
} = require("../middlewares/tokenControls/tokenControls");

const {
  crExpertRequest,
  cancelWrk,
  clExpertRequest,
  cancelWrkAccept,
  upgradeFinishedPrcnt,
  addNewPosition,
} = require("../middlewares/library/clientExpertTeamMid");
const {
  propWorks,
  getRequestedWorks,
  getAllWorks,
} = require("../middlewares/query/cetWorksQuery");

const dataControl = require("../middlewares/tokenControls/dataControl");
const queryMiddleware = require("../middlewares/query/queryMiddleware");
const uploadFile = require("../helpers/libraries/uploadFile");
const Team = require("../models/Team");
const JobInfo = require("../models/JobInfo");

const uploadProfileImg = uploadFile("teams/profiles", "profile_image_", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);
const uploadBackgroundImg = uploadFile("teams/profiles", "background_image", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);

// == == == == == == == == == == == == == == == == == == == ==
//  GET REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.get("/", (req, res, next) => {
  res.send("<h1>Welcome Teams Page</h1>");
});

router.get("/all", getAllTeam);

router.get("/logout", tokenControl, logoutTeam);

router.get(
  "/search_job",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.tm"),
    queryMiddleware(JobInfo, "job_tags", undefined, {
      job_name: 1,
      sector_id: 1,
    }),
  ],
  getSearchSubJob
);

router.get(
  "/get_all_prop_works",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.tm"),
    blockedControl(Team),
    propWorks,
  ],
  getAllPropWorks
);

router.get("/get_all_requested_works", [
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  blockedControl(Team),
  getRequestedWorks,
]);

router.get("/get-all-works", [
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  getAllWorks,
]);

// == == == == == == == == == == == == == == == == == == == ==
//  POST REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.post("/register", teamRegister(), registerTeam);

router.post("/login", teamSignIn(), signTeam);

router.post("/forgotpassword", CreateReqforgotPassword(), forgotPasswordTeam);

router.post("/resetpassword", CreateReqresetPassword(), resetPassword);

router.post(
  "/uploadProfileImage",
  [
    tokenControl,
    uploadProfileImg.single("profile_image"),
    uploadProfileImage(),
  ],
  uploadedPIController
);

router.post(
  "/uploadBackgroundImage",
  [
    tokenControl,
    dataControl,
    uploadBackgroundImg.single("background_image"),
    uploadBGImage(),
  ],
  uploadedBIController
);

router.post(
  "/createJobAnouncement",
  tokenControl,
  dataControl,
  tokenRoleControl("goodjoby.api.tm"),
  blockedControl(Team),
  createJobAnouncement
);

router.post("/social_sign_in", socialSignInUpController);

router.get(
  "/getAllJobAnouncement",
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  getAllJobAnouncement
);

// == == == == == == == == == == == == == == == == == == == ==
//  PUT REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/dateForInterview/",
  [tokenControl, tokenRoleControl("goodjoby.api.tm")],
  dateForInterview
);

router.put(
  "/add_new_jobs",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), blockedControl(Team)],
  addNewPosition(true),
  addNewJobs
);

router.put(
  "/cancel_job_announcement",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), blockedControl(Team)],
  cancelJobAnnouncement
);

// == == == == == == == == == == == == == == == == == == == ==
//  PARAM ROUTES
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/accept_job_application/:announcement_id",
  [tokenControl, tokenRoleControl("goodjoby.api.tm")],
  acceptJobApplication
);

router.put(
  "/upgrade_finished_percent/:work_id",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), upgradeFinishedPrcnt()],
  upgradeFinishedPercent
);

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

router.put(
  "/cancel_work/:work_id",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), cancelWrk(true, "team")],
  cancelWork
);

router.post(
  "/create_expert_request/:id",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.tm"),
    blockedControl(Team),
    crExpertRequest(true),
  ],
  createExpertRequest
);

router.put("/cancel_expert_request/:req_id", [
  tokenControl,
  [tokenRoleControl("goodjoby.api.tm"), blockedControl(Team), clExpertRequest],
  cancelExpertRequest,
]);

router.get(
  "/:username",
  [profileTokenControl, profileOwnerAccess()],
  profileTeam
);

module.exports = router;
