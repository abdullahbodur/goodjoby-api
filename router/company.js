const express = require("express");
const router = express.Router();
const {
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
  upgradeFinishedPercent,
  cancelJobAnnouncement,
} = require("../controllers/company");

const {
  companyRegister,
  companySignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
} = require("../helpers/Auth/companyAuthHelper");

const {
  tokenControl,
  profileTokenControl,
  tokenRoleControl,
  blockedControl,
} = require("../middlewares/tokenControls/tokenControls");

const {
  crExpertRequest,
  cancelWrk,
  cancelWrkAccept,
  upgradeFinishedPrcnt,
} = require("../middlewares/library/clientExpertCompanyMid");
const propWorks = require("../middlewares/query/propWorksMiddleware");
const dataControl = require("../middlewares/tokenControls/dataControl");
const queryMiddleware = require("../middlewares/query/queryMiddleware");
const uploadFile = require("../helpers/libraries/uploadFile");
const Company = require("../models/Company");
const JobInfo = require("../models/JobInfo");

const uploadProfileImg = uploadFile("companies/profiles", "profile_image_", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);
const uploadBackgroundImg = uploadFile(
  "companies/profiles",
  "background_image",
  ["image/png", "image/jpg", "image/jpeg"]
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.get("/", (req, res, next) => {
  res.send("<h1>Welcome Companies Page</h1>");
});

router.get("/all", getAllCompany);

router.get("/logout", tokenControl, logoutCompany);

router.get(
  "/search_job",
  [
    tokenControl,
    tokenRoleControl("company"),
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
    tokenRoleControl("company"),
    blockedControl(Company),
    propWorks,
  ],
  getAllPropWorks
);

// == == == == == == == == == == == == == == == == == == == ==
//  POST REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.post("/register", companyRegister(), registerCompany);

router.post("/login", companySignIn(), signCompany);

router.post(
  "/forgotpassword",
  CreateReqforgotPassword(),
  forgotPasswordCompany
);

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
  tokenRoleControl("company"),
  blockedControl(Company),
  createJobAnouncement
);

router.get(
  "/getAllJobAnouncement",
  tokenControl,
  tokenRoleControl("company"),
  getAllJobAnouncement
);

// == == == == == == == == == == == == == == == == == == == ==
//  PUT REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/dateForInterview/",
  [tokenControl, tokenRoleControl("company")],
  dateForInterview
);

router.put(
  "/add_new_jobs",
  [tokenControl, tokenRoleControl("company"), blockedControl(Company)],
  addNewJobs
);

router.put(
  "/cancel_job_announcement",
  [tokenControl, tokenRoleControl("company"), blockedControl(Company)],
  cancelJobAnnouncement
);

// == == == == == == == == == == == == == == == == == == == ==
//  PARAM ROUTES
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/accept_job_application/:announcement_id",
  [tokenControl, tokenRoleControl("company")],
  acceptJobApplication
);

router.put(
  "/upgrade_finished_percent/:work_id",
  [tokenControl, tokenRoleControl("company"), upgradeFinishedPrcnt()],
  upgradeFinishedPercent
);

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

router.put(
  "/cancel_work/:work_id",
  [tokenControl, tokenRoleControl("company"), cancelWrk(true, "company")],
  cancelWork
);

router.post(
  "/create_expert_request/:id",
  [
    tokenControl,
    tokenRoleControl("company"),
    blockedControl(Company),
    crExpertRequest(true),
  ],
  createExpertRequest
);

router.get(
  "/:username",
  [profileTokenControl, profileOwnerAccess()],
  profileCompany
);

module.exports = router;
