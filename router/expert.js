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
} = require("../controllers/expert");

const {
  expertRegister,
  expertSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
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
} = require("../middlewares/library/clientExpertCompanyMid");
const propWorks = require("../middlewares/query/propWorksMiddleware");
const queryMiddleware = require("../middlewares/query/queryMiddleware");
const uploadFile = require("../helpers/libraries/uploadFile");
const dataControl = require("../middlewares/tokenControls/dataControl");
const Expert = require("../models/Expert");
const JobInfo = require("../models/JobInfo");

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

// == == == == == == == == == == == == == == == == == == == ==
//  GET REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.get("/all", getAllExpert);

router.get("/logout", tokenControl, logoutExpert);

router.get(
  "/search_job",
  [
    tokenControl,
    tokenRoleControl("expert"),
    queryMiddleware(JobInfo, "job_tags", undefined, {
      job_name: 1,
      sector_id: 1,
    }),
  ],
  getSearchSubJob
);

router.get(
  "/get_all_prop_works",
  [tokenControl, tokenRoleControl("expert"), blockedControl(Expert), propWorks],
  getAllPropWorks
);

// == == == == == == == == == == == == == == == == == == == ==
//  POST REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.post("/register", expertRegister(), registerExpert);

router.post("/login", expertSignIn(), signExpert);

router.post("/forgotpassword", CreateReqforgotPassword(), forgotPasswordExpert);

router.post("/resetpassword", CreateReqresetPassword(), resetPassword);

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
//  PUT ROUTES
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/add_new_jobs",
  [tokenControl, tokenRoleControl("expert"), blockedControl(Expert)],
  addNewJobs
);

// == == == == == == == == == == == == == == == == == == == ==
//  PARAM ROUTES
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_work/:work_id",
  [
    tokenControl,
    tokenRoleControl("expert"),
    blockedControl(Expert),
    cancelWrk(true, "expert"),
  ],
  cancelWork
);

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

router.get(
  "/cancel_expert_request/:req_id",
  [
    tokenControl,
    tokenRoleControl("expert"),
    blockedControl(Expert),
    clExpertRequest,
  ],
  cancelExpertRequest
);

router.post(
  "/create_expert_request/:id",
  [
    tokenControl,
    tokenRoleControl("expert"),
    blockedControl(Expert),
    crExpertRequest(false),
  ],
  createExpertRequest
);

router.post(
  "/add_document_for_application/:id",
  [
    tokenControl,
    tokenRoleControl("expert"),
    blockedControl(Expert),
    uploadDocuments.array("document"),
  ],
  uploadNewDocuments
);

router.post(
  "/createNewApplication/:id",
  [
    tokenControl,
    dataControl,
    tokenRoleControl("expert"),
    blockedControl(Expert),
  ],
  createnewApplication
);

router.get(
  "/:username", 
  [profileTokenControl, profileOwnerAccess()],
  profileExpert
);

module.exports = router;
