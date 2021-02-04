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
  verificationSendController,
  acceptingVerificationController,
  updateLocationController,
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
  verificationTokenHandler,
  verificationTokenAcceptHandler,
  updateLocationHandler,
  registerTeamProfile,
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
const { registerClientProfile } = require("../helpers/Auth/clientAuthHelper");

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

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** GET REQUESTS ******** GET REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL TEAM USERS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/all", getAllTeam);

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/logout", tokenControl, logoutTeam);

// == == == == == == == == == == == == == == == == == == == ==
//  SEARCH JOB
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==
//  => QUERY ATTRIBUTES
//    * search
// == == == == == == == == == == == == == == == == == == == ==

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

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL PROP WORKS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

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

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL REQUESTED WORKS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==
//  => QUERY ATTRIBUTES
//    * limit
// == == == == == == == == == == == == == == == == == == == ==

router.get("/get_all_requested_works", [
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  blockedControl(Team),
  getRequestedWorks,
]);

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL WORKS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/get-all-works", [
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  getAllWorks,
]);

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATE USER ACCOUNT by USING EMAIL VERIFICATION
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/signup/verificate",
  [
    tokenControl,
    blockedControl(Team),
    tokenRoleControl("goodjoby.api.tm"),
    verificationTokenHandler(),
  ],
  verificationSendController
);

// == == == == == == == == == == == == == == == == == == == ==
//  ACCEPTING VERIFICATION LINK
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/signup/verified",
  verificationTokenAcceptHandler(),
  acceptingVerificationController
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL JOB ANNOUNCEMENT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/get_all_job_announcement",
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  getAllJobAnouncement
);

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** POST REQUESTS ******** POST REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER TEAM ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * name
//    * password
//    * email
//    * username (optional = auto generate)
// == == == == == == == == == == == == == == == == == == == ==

router.post("/register", teamRegister(), registerTeam);

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN IN TEAM ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * password
//    * email
// == == == == == == == == == == == == == == == == == == == ==

router.post("/login", teamSignIn(), signTeam);

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD EXPERT ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * email or username
// == == == == == == == == == == == == == == == == == == == ==

router.post("/forgotpassword", CreateReqforgotPassword(), forgotPasswordTeam);

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD EXPERT ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * email or username
// == == == == == == == == == == == == == == == == == == == ==

router.post("/resetpassword", CreateReqresetPassword(), resetPassword);

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * profile_image (form-data)
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/uploadProfileImage",
  [
    tokenControl,
    uploadProfileImg.single("profile_image"),
    uploadProfileImage(),
  ],
  uploadedPIController
);

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * background_image (form-data)
// == == == == == == == == == == == == == == == == == == == ==

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

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE JOB ANNOUNCEMENT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * content
//    * aim_job
//    * expireDate
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_job_announcement",
  tokenControl,
  dataControl,
  tokenRoleControl("goodjoby.api.tm"),
  blockedControl(Team),
  createJobAnouncement
);

// == == == == == == == == == == == == == == == == == == == ==
//  SOCIAL SIGN IN
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * account_tye
//    * accessToken
// == == == == == == == == == == == == == == == == == == == ==

router.post("/social_sign_in", socialSignInUpController);

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ********** PUT REQUESTS ********** PUT REQUESTS **********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  DATE FOR INTERVIEW - TEAM
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * application_id
//    * interview_date
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/date_for_interview/",
  [tokenControl, tokenRoleControl("goodjoby.api.tm")],
  dateForInterview
);

// == == == == == == == == == == == == == == == == == == == ==
//  ADD NEW JOBS - TEAM
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * sector_id
//    * position
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/add_new_jobs",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), blockedControl(Team)],
  addNewPosition(true),
  addNewJobs
);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL JOB ANNOUNCEMENT - TEAM
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * announcement_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_job_announcement",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), blockedControl(Team)],
  cancelJobAnnouncement
);

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * state_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/update_location",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.tm"),
    blockedControl(Team),
    updateLocationHandler(),
  ],
  updateLocationController
);

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER PROFILE
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * username
//    * location
//    * phone_number
//    * gender
//    * bio
// == == == == == == == == == == == == == == == == == == == ==

router.put("/register_profile", [
  tokenControl,
  tokenRoleControl("goodjoby.api.tm"),
  blockedControl(Team),
  registerClientProfile(),
]);

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** PARAMS REQUESTS ******** PARAMS REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  ACCEPT JOB APPICATION
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * application_id
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * announcement_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/accept_job_application/:announcement_id",
  [tokenControl, tokenRoleControl("goodjoby.api.tm")],
  acceptJobApplication
);

// == == == == == == == == == == == == == == == == == == == ==
//  UPGRADE FINISHED PERCENT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * finished_percent
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/upgrade_finished_percent/:work_id",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), upgradeFinishedPrcnt()],
  upgradeFinishedPercent
);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - TEAM
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK - TEAM
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_work/:work_id",
  [tokenControl, tokenRoleControl("goodjoby.api.tm"), cancelWrk(true, "team")],
  cancelWork
);

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE EXPERT REQUESTS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * id
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * title
//    * content
//    * price
// == == == == == == == == == == == == == == == == == == == ==

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

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL EXPERT REQUESTS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * req_id
// == == == == == == == == == == == == == == == == == == == ==

router.put("/cancel_expert_request/:req_id", [
  tokenControl,
  [tokenRoleControl("goodjoby.api.tm"), blockedControl(Team), clExpertRequest],
  cancelExpertRequest,
]);

// == == == == == == == == == == == == == == == == == == == ==
//  GET TEAM BY USING USERNAME
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * username
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/:username",
  [profileTokenControl, profileOwnerAccess()],
  profileTeam
);

module.exports = router;
