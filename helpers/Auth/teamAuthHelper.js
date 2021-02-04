const {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver,
  acceptVerificationToken,
  socialSignInUp,
  verificationNewRequest,
  updateLocation,
  registerProfile,
} = require("./authHelper");
const Team = require("../../models/Team");

// == == == == == == == == == == == == == == == == == == == ==
//  TEAM REGISTER ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const teamRegister = function () {
  return (req, res, next) => {
    authRegister(Team, req, res, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  TEAM SIGN IN ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const teamSignIn = () => {
  return (req, res, next) => {
    authSignIn(Team, req, res, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  TEAM GET PROFILE OWNER ACCESS
// == == == == == == == == == == == == == == == == == == == ==

const profileOwnerAccess = () => {
  return (req, res, next) => {
    profileOwnerAccessControl(req, Team, next, "team");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE REQUEST FORGOT PASSWORD FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqforgotPassword = () => {
  return (req, res, next) => {
    forgotPassword(Team, req, res, next, "team");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW PASSWORD IF HAS A TOKEN FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqresetPassword = () => {
  return (req, res, next) => {
    resetPasswordWithAuthHelper(req, next, Team);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadProfileImage = () => {
  return (req, res, next) => {
    uploadedPFSaver(Team, req, next, "profile_image");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR TEAM
// == == == == == == == == == == == == == == == == == == == ==

const uploadBGImage = () => {
  return (req, res, next) => {
    uploadedPFSaver(Team, req, next, "background_image");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  SOCIAL SIGN IN - UP CONTROLER
// == == == == == == == == == == == == == == == == == == == ==

const socialSignInUpController = () => {
  return (req, res, next) => {
    socialSignInUp(req, res, next, Team);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATION TOKEN HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationTokenHandler = () => {
  return (req, res, next) => {
    verificationNewRequest(Team, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFICATION ACCEPT HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationTokenAcceptHandler = () => {
  return (req, res, next) => {
    acceptVerificationToken(Team, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION HANDLER
// == == == == == == == == == == == == == == == == == == == ==

const updateLocationHandler = () => {
  return (req, res, next) => {
    updateLocation(Team, req, next);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER TEAM PROFILE
// == == == == == == == == == == == == == == == == == == == ==

const registerTeamProfile = () => {
  return (req, res, next) => {
    registerProfile(Team, req, next);
  };
};

module.exports = {
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
};
