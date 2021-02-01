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
  socialIDController,
  verificationSendController,
  acceptingVerificationController,
  updateLocationController,
} = require("../controllers/client");

const {
  clientRegister,
  clientSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
  socialSignInUpController,
  verificationTokenHandler,
  verificationTokenAcceptHandler,
  updateLocationHandler,
} = require("../helpers/Auth/clientAuthHelper");

const {
  tokenControl,
  profileTokenControl,
  tokenRoleControl,
  blockedControl,
} = require("../middlewares/tokenControls/tokenControls");

const {
  cancelWrk,
  cancelWrkAccept,
} = require("../middlewares/library/clientExpertTeamMid");
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

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** GET REQUESTS ******** GET REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL CLIENT USERS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/all", getAllClient);

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get("/logout", tokenControl, logoutClient);

// == == == == == == == == == == == == == == == == == == == ==
//  SEARCH SERVICES
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

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

// == == == == == == == == == == == == == == == == == == == ==
//  GET MESSAGES
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/get_message",
  [tokenControl, tokenRoleControl("goodjoby.api.cli")],
  getMessages
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET WORKS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    *none
// == == == == == == == == == == == == == == == == == == == ==

router.get(
  "/get_works",
  [
    tokenControl,
    blockedControl(Client),
    tokenRoleControl("goodjoby.api.cli"),
    getWorksClient(Work, undefined, "-__v -is_team -expert_type -rates -state"),
  ],
  getWorks
);

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
    blockedControl(Client),
    tokenRoleControl("goodjoby.api.cli"),
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
//  REGISTER CLIENT ACCOUNT
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

router.post("/register", clientRegister(), registerClient);

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN IN CLIENT ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * password
//    * email
// == == == == == == == == == == == == == == == == == == == ==

router.post("/login", clientSignIn(), signClient);

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD CLIENT ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * email or username
// == == == == == == == == == == == == == == == == == == == ==

router.post("/forgotpassword", CreateReqforgotPassword(), forgotPasswordClient);

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD CLIENT ACCOUNT
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
    blockedControl(Client),
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
    blockedControl(Client),
    uploadBackgroundImg.single("background_image"),
    uploadBGImage(),
  ],
  uploadedBIController
);

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE PENDING WORK
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * description
//    * expireAt
//    * service_id
//    * answers
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_pending_work",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.cli"),
    blockedControl(Client) /*modelAccess(Client)*/,
  ],
  createPendingWork
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

router.post("/social_sign_in", socialSignInUpController());

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** PUT REQUESTS ******** PUT REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

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
    tokenRoleControl("goodjoby.api.cli"),
    blockedControl(Client),
    updateLocationHandler(),
  ],
  updateLocationController
);

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** PARAMS REQUESTS ******** PARAMS REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.get("/cancel_work_accept/:work_id", cancelWrkAccept, cancelWorkAccept);

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
    tokenRoleControl("goodjoby.api.cli"),
    blockedControl(Client),
    cancelWrk(true, "client"),
  ],
  cancelWork
);

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL PENDING WORK
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * work_id
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/cancel_p_work/:work_id",
  [tokenControl, tokenRoleControl("goodjoby.api.cli"), blockedControl(Client)],
  cancelAnyPendingWork
);

// == == == == == == == == == == == == == == == == == == == ==
//  ACCEPT OFFER
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * offer_id
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * pending_work_id
//    * expireAt
// == == == == == == == == == == == == == == == == == == == ==
router.put(
  "/accept_offer/:offer_id",
  [tokenControl, tokenRoleControl("goodjoby.api.cli"), blockedControl(Client)],
  acceptAnyOffer
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET SERVICE QUESTIONS
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * none
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * service_id
// == == == == == == == == == == == == == == == == == == == ==

router.get("/get_service_questions/:service_id", getServiceQuestions);

// == == == == == == == == == == == == == == == == == == == ==
//  ADD DOCUMENT TO WORK - CLIENT
// == == == == == == == == == == == == == == == == == == == ==
//  => ADDITION HEADERS:
//   * Connection = accessToken
// == == == == == == == == == == == == == == == == == == == ==
//  => PARAM ATTRIBUTES:
//    * service_id
// == == == == == == == == == == == == == == == == == == == ==
//  => BODY ATTRIBUTES:
//    * document
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/add_document_to_work/:id",
  [
    tokenControl,
    tokenRoleControl("goodjoby.api.cli"),
    blockedControl(Client),
    uploadDocuments.array("document"),
  ],
  uploadNewDocuments
);

// == == == == == == == == == == == == == == == == == == == ==
//  GET SINGLE USERNAME
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
  [profileTokenControl, blockedControl(Client), profileOwnerAccess()],
  profileClient
);

module.exports = router;
