const express = require("express");
const router = express.Router();

const {
  profileExpert,
  logoutExpert,
  registerExpert,
  signExpert,
  resetPassword,
  forgotPasswordExpert,
  getAllExpert,
  uploadedPIController,
  uploadedBIController,
  createnewApplication,
  uploadNewDocuments,
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
  acceptingVerificationController,
  updateLocationController,
  registerProfile,
} = require("../controllers/expert");

const {
  expertRegister,
  expertSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
  socialSignInUpController,
  verificationTokenAcceptHandler,
  verificationTokenHandler,
  updateLocationHandler,
} = require("../helpers/Auth/expertAuthHelper");

const {
  tokenControl,
  profileTokenControl,
  tokenRoleControl,
  blockedControl,
} = require("../middlewares/tokenControls/tokenControls");

const {
  crExpertRequest,
  clExpertRequest,
  cancelWrkAccept,
  cancelWrk,
  addNewPosition,
} = require("../middlewares/library/clientExpertTeamMid");
const {
  propWorks,
  getRequestedWorks,
  getAllWorks,
} = require("../middlewares/query/cetWorksQuery");
const queryMiddleware = require("../middlewares/query/queryMiddleware");
const uploadFile = require("../helpers/libraries/uploadFile");
const dataControl = require("../middlewares/tokenControls/dataControl");
const Expert = require("../models/Expert");
const JobInfo = require("../models/JobInfo");
const { registerClientProfile } = require("../helpers/Auth/clientAuthHelper");

const uploadProfileImg = uploadFile("experts/profiles", "profile_image_", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);
const uploadBackgroundImg = uploadFile("experts/profiles", "background_image", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);
const uploadDocuments = uploadFile(
  "experts/documents",
  "job_document_",
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-powerpoint",
    "image/png",
    "image/jpg",
    "image/jpeg",
  ],
  true,
  "40mb"
);

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** GET REQUESTS ******** GET REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL EXPERT USERS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/all", getAllExpert);

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/logout", tokenControl, logoutExpert);

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
    tokenRoleControl("goodjoby.api.exp"),
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
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
    propWorks,
  ],
  getAllPropWorks
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL PROP JOB ANNOUNCEMENTS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/get-all-prop-job-announcements",
  [tokenControl, tokenRoleControl("goodjoby.api.exp"), blockedControl(Expert)],
  getAllPropJobAnnouncements
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
  tokenRoleControl("goodjoby.api.exp"),
  blockedControl(Expert),
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
  tokenRoleControl("goodjoby.api.exp"),
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
    blockedControl(Expert),
    tokenRoleControl("goodjoby.api.exp"),
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

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** POST REQUESTS ******** POST REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER EXPERT ACCOUNT
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

router.post("/register", expertRegister(), registerExpert);

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN IN EXPERT ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * password
//    * email
// == == == == == == == == == == == == == == == == == == == ==

router.post("/login", expertSignIn(), signExpert);

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD EXPERT ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * email or username
// == == == == == == == == == == == == == == == == == == == ==

router.post("/forgotpassword", CreateReqforgotPassword(), forgotPasswordExpert);

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
    blockedControl(Expert),
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
    blockedControl(Expert),
    uploadBackgroundImg.single("background_image"),
    uploadBGImage(),
  ],
  uploadedBIController
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
//  ADD NEW JOBS - EXPERT
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
  [tokenControl, tokenRoleControl("goodjoby.api.exp"), blockedControl(Expert)],
  addNewPosition(false),
  addNewJobs
);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL JOB APPLICATION - EXPERT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * application_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_job_application",
  [tokenControl, tokenRoleControl("goodjoby.api.exp"), blockedControl(Expert)],
  cancelJobApplication
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
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
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

router.put(
  "/register_profile",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
    registerClientProfile(),
  ],
  registerProfile
);

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** PARAMS REQUESTS ******** PARAMS REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_work/:work_id",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
    cancelWrk(true, "expert"),
  ],
  cancelWork
);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPTS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL EXPERT REQUESTS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * req_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_expert_request/:req_id",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
    clExpertRequest,
  ],
  cancelExpertRequest
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
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
    crExpertRequest(false),
  ],
  createExpertRequest
);

// == == == == == == == == == == == == == == == == == == == ==
//  ADD DOCUMENT FOR APPLICATION
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * id
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * document
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/add_document_for_application/:id",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
    uploadDocuments.array("document"),
  ],
  uploadNewDocuments
);

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW APPLICATION
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
//    * team
//    * documents
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_new_application/:id",
  [
    tokenControl,
    dataControl,
    tokenRoleControl("goodjoby.api.exp"),
    blockedControl(Expert),
  ],
  createnewApplication
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET EXPERT BY USING USERNAME
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
  profileExpert
);

module.exports = router;
