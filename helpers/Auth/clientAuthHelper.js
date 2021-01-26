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

const Client = require("../../models/Client");

// == == == == == == == == == == == == == == == == == == == ==
//  CLIENT REGISTER ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const clientRegister = function () {
  return errorHandlerWrapper(async (req, res, next) => {
    res.data = await authRegister(Client, req, res);
    next();
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CLIENT SIGN IN ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const clientSignIn = () => {
  return (req, res, next) => {
    authSignIn(Client, req, res, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CLIENT GET PROFILE OWNER ACCESS
// == == == == == == == == == == == == == == == == == == == ==

const profileOwnerAccess = () => {
  return (req, res, next) => {
    profileOwnerAccessControl(req, Client, next, "client");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE REQUEST FORGOT PASSWORD FOR CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqforgotPassword = () => {
  return (req, res, next) => {
    forgotPassword(Client, req, res, next, "client");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW PASSWORD IF HAS A TOKEN FOR CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqresetPassword = () => {
  return (req, res, next) => {
    resetPasswordWithAuthHelper(req, next, Client);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE FOR CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const uploadProfileImage = () => {
  return (req, res, next) => {
    uploadedPFSaver(Client, req, next, "profile_image");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const uploadBGImage = () => {
  return (req, res, next) => {
    uploadedPFSaver(Client, req, next, "background_image");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  SOCIAL SIGN IN - UP CONTROLER
// == == == == == == == == == == == == == == == == == == == ==

const socialSignInUpController = () => {
  return (req, res, next) => {
    socialSignInUp(req, res, next, Client);
  };
};

module.exports = {
  clientRegister,
  clientSignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage,
  socialSignInUpController,
};
