const {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver,
  socialSignInUp,
  acceptVerificationToken,
  verificationNewRequest,
  updateLocation,
} = require("./authHelper");

const Expert = require("../../models/Expert");

// == == == == == == == == == == == == == == == == == == == ==
//  EXPERT REGISTER ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const expertRegister = function () {
  return (req, res, next) => {
    authRegister(Expert, req, res, next);
  };
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

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATION TOKEN HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationTokenHandler = () => {
  return (req, res, next) => {
    verificationNewRequest(Expert, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATION ACCEPT HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationTokenAcceptHandler = () => {
  return (req, res, next) => {
    acceptVerificationToken(Expert, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const updateLocationHandler = () => {
  return (req, res, next) => {
    updateLocation(Expert, req, next);
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
  verificationTokenHandler,
  verificationTokenAcceptHandler,
  updateLocationHandler,
};
