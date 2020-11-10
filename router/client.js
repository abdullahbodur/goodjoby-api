const express = require("express");
const router = express.Router();

const {
  profileClient,
  logoutClient,
  registerClient,
  signClient,
  resetPassword,
  forgotPasswordClient,
  getAllClient,
  uploadedPIController,
  uploadedBIController,
  createPendingWork,
  uploadNewDocuments,
  getSearchService,
  getServiceQuestions,
  acceptAnyOffer,
  cancelAnyPendingWork,
  cancelWork,
  cancelWorkAccept,
  getWorks,
  getMessages,
} = require("../controllers/client");

const {
  clientRegister,
  clientSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
} = require("../helpers/Auth/clientAuthHelper");

const {
  tokenControl,
  profileTokenControl,
  tokenRoleControl,
  blockedControl
} = require("../middlewares/tokenControls/tokenControls");

const {
  cancelWrk,
  cancelWrkAccept,
} = require("../middlewares/library/clientExpertCompanyMid");
const uploadFile = require("../helpers/libraries/uploadFile");
const Client = require("../models/Client");
const JobInfo = require("../models/JobInfo");
const queryMiddleware = require("../middlewares/query/queryMiddleware");
const getWorksClient = require("../middlewares/query/getWorksClient");
const Work = require("../models/Work");

const uploadProfileImg = uploadFile("clients/profiles", "profile_image_", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);
const uploadBackgroundImg = uploadFile("clients/profiles", "background_image", [
  "image/png",
  "image/jpg",
  "image/jpeg",
]);

const uploadDocuments = uploadFile(
  "works/documents",
  "work_document_",
  ["image/png", "image/jpg", "image/jpeg"],
  true
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.get("/all", getAllClient);

router.get("/logout", tokenControl, logoutClient);

router.get(
  "/search_service",
  [
    queryMiddleware(JobInfo, "job_tags", undefined, {
      job_name: 1,
      question_filters: 1,
    }),
  ],
  getSearchService
);

router.get(
  "/get_message",
  // [tokenControl, tokenRoleControl("client")],
  getMessages
);

router.get(
  "/get_works",
  [
    tokenControl,
    blockedControl(Client),
    tokenRoleControl("client"),
    getWorksClient(
      Work,
      undefined,
      "-__v -is_company -expert_type -rates -state"
    ),
  ],
  getWorks
);

// == == == == == == == == == == == == == == == == == == == ==
//  POST REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.post("/register", clientRegister(), registerClient);

router.post("/login", clientSignIn(), signClient);

router.post("/forgotpassword", CreateReqforgotPassword(), forgotPasswordClient);

router.post("/resetpassword", CreateReqresetPassword(), resetPassword);

router.post(
  "/uploadProfileImage",
  [
    tokenControl, 
    blockedControl(Client),
    uploadProfileImg.single("profile_image"),
    uploadProfileImage(),
  ],
  uploadedPIController
);

router.post(
  "/uploadBackgroundImage",
  [
    tokenControl,
    blockedControl(Client),
    uploadBackgroundImg.single("background_image"),
    uploadBGImage(),
  ],
  uploadedBIController
);

router.post(
  "/create_pending_work",
  [tokenControl, tokenRoleControl("client"),blockedControl(Client) /*modelAccess(Client)*/],
  createPendingWork
);

// == == == == == == == == == == == == == == == == == == == ==
//  PARAM ROUTES
// == == == == == == == == == == == == == == == == == == == ==

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

router.put(
  "/cancel_work/:work_id",
  [tokenControl, tokenRoleControl("client"),blockedControl(Client), cancelWrk(true, "client")],
  cancelWork
);

router.put(
  "/cancel_p_work/:work_id",
  [tokenControl, tokenRoleControl("client"),blockedControl(Client),],
  cancelAnyPendingWork
);

router.put(
  "/accept_offer/:offer_id",
  [tokenControl, tokenRoleControl("client"),blockedControl(Client),],
  acceptAnyOffer
);

router.get("/get_service_questions/:service_id", getServiceQuestions);

router.post(
  "/add_document_to_work/:id",
  [tokenControl, tokenRoleControl("client"),blockedControl(Client), uploadDocuments.array("document")],
  uploadNewDocuments
);

router.get(
  "/:username",
  [profileTokenControl,blockedControl(Client), profileOwnerAccess()],
  profileClient
);

module.exports = router;
