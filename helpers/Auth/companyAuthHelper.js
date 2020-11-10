const errorHandlerWrapper = require("express-async-handler");
const {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver
} = require("./authHelper");
const Company = require("../../models/Company");

 
// == == == == == == == == == == == == == == == == == == == ==
//  COMPANY REGISTER ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const companyRegister = function () {
  return errorHandlerWrapper(async (req, res, next) => {
    res.data = await authRegister(Company, req, res);
    next();
  });
};


// == == == == == == == == == == == == == == == == == == == ==
//  COMPANY SIGN IN ACCOUNT
// == == == == == == == == == == == == == == == == == == == ==

const companySignIn = () => {
  return (req, res, next) => {
    authSignIn(Company, req, res, next);
  };
};


// == == == == == == == == == == == == == == == == == == == ==
//  COMPANY GET PROFILE OWNER ACCESS
// == == == == == == == == == == == == == == == == == == == ==

const profileOwnerAccess = () => {
  return (req, res, next) => {
    profileOwnerAccessControl(req, Company, next,"company");
  };
};


// == == == == == == == == == == == == == == == == == == == ==
//  CREATE REQUEST FORGOT PASSWORD FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqforgotPassword = () => {
  return (req, res, next) => {
    forgotPassword(Company, req, res, next, "company");
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW PASSWORD IF HAS A TOKEN FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==

const CreateReqresetPassword = () => {
  return (req, res, next) => {
    resetPasswordWithAuthHelper(req, next, Company);
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==


const uploadProfileImage = ()=>{
  return (req,res,next)=>{
    uploadedPFSaver(Company,req,next,"profile_image")
  }
}


// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE FOR COMPANY
// == == == == == == == == == == == == == == == == == == == ==


const uploadBGImage = ()=>{
  return (req,res,next)=>{
    uploadedPFSaver(Company,req,next,"background_image")
  }
}


module.exports = {
  companyRegister,
  companySignIn,
  profileOwnerAccess,
  CreateReqforgotPassword,
  CreateReqresetPassword,
  uploadProfileImage,
  uploadBGImage
};
