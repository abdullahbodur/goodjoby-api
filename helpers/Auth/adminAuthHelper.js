const errorHandlerWrapper = require("express-async-handler");
const { authRegister, authSignIn } = require("./authHelper");

const Admin = require("../../models/Admin");
const CustomError = require("../error/CustomError");

// == == == == == == == == == == == == == == == == == == == ==
//  ADMIN REGISTER
// == == == == == == == == == == == == == == == == == == == ==

const adminRegisterHelper = errorHandlerWrapper(async (req, res, next) => {
  if (req.user.stg <= req.body.stage)
    return next(
      new CustomError("Your Authorization is not supported this event", 403)
    );
  res.admin = await authRegister(Admin, req, res, next);
  next();
});

// == == == == == == == == == == == == == == == == == == == ==
//  ADMIN LOGIN
// == == == == == == == == == == == == == == == == == == == ==

const adminSignInHelper = (req, res, next) => {
  return authSignIn(Admin, req, res, next);
};

module.exports = {
  adminRegisterHelper,
  adminSignInHelper,
};
