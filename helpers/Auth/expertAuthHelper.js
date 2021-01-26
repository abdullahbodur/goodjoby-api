const errorHandlerWrapper = require("express-async-handler");
const {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver,
  socialSignInUp,
} = require("./authHelper");

const Expert = require("../../models/Expert");

// == == == == == == == == == == == == == == == == == == == ==
//  EXPERT REGISTER ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const expertRegister = function () {
  return errorHandlerWrapper(async (req, res, next) => {
    res.data = await authRegister(Expert, req, res);
    next();
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  EXPERT SIGN IN ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const expertSignIn = () => {
  return (req, res, next) => {
    authSignIn(Expert, req, res, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  EXPERT GET PROFILE OWNER ACCESS
// == == == == == == == == == == == == == == == == == == == ==

const profileOwnerAccess = () => {
  return (req, res, next) => {
    profileOwnerAccessControl(req, Expert, next, "expert");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE REQUEST FORGOT PASSWORD FOR EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqforgotPassword = () => {
  return (req, res, next) => {
    forgotPassword(Expert, req, res, next, "expert");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW PASSWORD IF HAS A TOKEN FOR EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqresetPassword = () => {
  return (req, res, next) => {
    resetPasswordWithAuthHelper(req, next, Expert);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadProfileImage = () => {
  return (req, res, next) => {
    uploadedPFSaver(Expert, req, next, "profile_image");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadBGImage = () => {
  return (req, res, next) => {
    uploadedPFSaver(Expert, req, next, "background_image");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  SOCIAL SIGN IN - UP CONTROLER
// == == == == == == == == == == == == == == == == == == == ==

const socialSignInUpController = () => {
  return (req, res, next) => {
    socialSignInUp(req, res, next, Expert);
  };
};
module.exports = {
  expertRegister,
  expertSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
  socialSignInUpController,
};
