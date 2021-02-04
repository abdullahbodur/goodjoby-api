const {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver,
  socialSignInUp,
  verificationNewRequest,
  acceptVerificationToken,
  updateLocation,
  registerProfile,
} = require("./authHelper");

const Client = require("../../models/Client");

// == == == == == == == == == == == == == == == == == == == ==
//  CLIENT REGISTER ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const clientRegister = function () {
  return (req, res, next) => {
    authRegister(Client, req, res, next);
  };
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

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATION TOKEN HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationTokenHandler = () => {
  return (req, res, next) => {
    verificationNewRequest(Client, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATION ACCEPT HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationTokenAcceptHandler = () => {
  return (req, res, next) => {
    acceptVerificationToken(Client, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const updateLocationHandler = () => {
  return (req, res, next) => {
    updateLocation(Client, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER CLIENT PROFILE
// == == == == == == == == == == == == == == == == == == == ==

const registerClientProfile = () => {
  return (req, res, next) => {
    registerProfile(Client, req, next);
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
  verificationTokenHandler,
  verificationTokenAcceptHandler,
  updateLocationHandler,
  registerClientProfile,
};
