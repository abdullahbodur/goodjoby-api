const errorHandlerWrapper = require("express-async-handler");
const {
  inputControl,
  comparePasswordInModel,
} = require("../inputHelper/inputHelper");
const CustomError = require("../error/CustomError");
const sendMail = require("../libraries/sendMail");
const { sendJwtToUser } = require("../authorization/tokenHelpers");
const Admin = require("../../models/Admin");

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const authRegister = errorHandlerWrapper(async (model, req, res) => {
  const data = req.body;
  const objectModel = await model.create(data);

  sendJwtToUser(objectModel, res);
});

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN IN CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const authSignIn = errorHandlerWrapper(async (model, req, res, next) => {
  let { email, password } = req.body;

  if (!inputControl)
    return next(new CustomError("Please, provide email and password", 400));

  email.toLowerCase();

  const objectModel = await model.findOne({ email: email }).select("+password");

  if (objectModel === null)
    return next(
      new CustomError("Email or Password is wrong, Please try again", 400)
    );

  if (!comparePasswordInModel(password, objectModel.password))
    return next(
      new CustomError("Email or Password is wrong, Please try again", 400)
    );

  if (objectModel.blocked)
    return next(
      new CustomError("You are have been banned for any reason", 403)
    );

  sendJwtToUser(objectModel, res);
});

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN IN ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const adminSignInHelp = errorHandlerWrapper(async (req, res, next) => {
  let { email, password } = req.body;

  if (!inputControl) {
    return next(new CustomError("Please, provide email and password", 400));
  }

  email.toLowerCase();

  const admin = await Admin.findOne({ email: email }).select("+password");

  if (objectModel === null) {
    return next(
      new CustomError("Email or Password is wrong, Please try again", 400)
    );
  }

  if (!comparePasswordInModel(password, admin.password)) {
    return next(
      new CustomError("Email or Password is wrong, Please try again", 400)
    );
  }

  sendJwtToUser(admin, res);
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET PROFILE OWNER ACCESS TEAM - CLIENT - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const profileOwnerAccessControl = errorHandlerWrapper(
  async (req, model, next, name) => {
    let isHasToken = true;
    if (req.user === undefined) {
      isHasToken = false;
    }

    const { username } = req.params;

    const objectModel = await model
      .findOne({ username: username })
      .select("-token -tokenExpire -role -email -__v");

    if (!objectModel) {
      return next(
        new CustomError(`There is no ${name} with that username`, 400)
      );
    }

    req.profile = objectModel;

    const objectModelId = String(objectModel._id);

    if (isHasToken && objectModelId !== req.user.client_id) {
      req.profileOwnerAccess = false;
      return next();
    }

    isHasToken
      ? (req.profileOwnerAccess = true)
      : (req.profileOwnerAccess = false);
    return next();
  }
);

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const forgotPassword = errorHandlerWrapper(
  async (model, req, res, next, name) => {
    const { emailOrUsername } = req.body;
    const { DOMAIN_URI, PORT } = process.env;

    if (!emailOrUsername) {
      return next(new CustomError("Please provide an username or email", 400));
    }

    const objectModel = await model.findOne({
      $or: [
        { email: { $regex: emailOrUsername, $options: "i" } },
        { username: { $regex: emailOrUsername, $options: "i" } },
      ],
    });

    if (objectModel === null) {
      return next(
        new CustomError("There is no user that given information", 400)
      );
    }
    const token = objectModel.getTokenFromUser();
    await objectModel.save();

    console.log(token);

    // Change HTTP WHEN YOU ARE DEPLOYING !!!

    const resetPasswordUrl = `http://${DOMAIN_URI}${PORT}/api/${name}/resetpassword?resetPasswordToken=${token}`;

    try {
      await sendMail({
        from: process.env.SMTP_USER,
        to: objectModel.email,
        subject: "Reset Password",
        html: AuthTemplates.resetPassword(resetPasswordUrl),
      });
    } catch (error) {
      objectModel.token = undefined;
      objectModel.tokenExpire = undefined;

      await objectModel.save();

      return next(new CustomError("Email could not send to client", 500));
    }

    return next();
  }
);

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD WITH TOKEN  TEAM - CLIENT - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const resetPasswordWithAuthHelper = errorHandlerWrapper(
  async (req, next, model) => {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    const objectModel = await model.findOne({
      token: resetPasswordToken,
      tokenExpire: { $gt: Date.now() },
    });

    if (!objectModel) {
      return next(new CustomError("Ops, token is invalid or expired", 400));
    }
    try {
      objectModel.password = password;
      objectModel.token = undefined;
      objectModel.tokenExpire = undefined;

      await objectModel.save();
    } catch (error) {
      return next(error);
    }

    return next();
  }
);

const uploadedPFSaver = errorHandlerWrapper(async (model, req, next, prop) => {
  let obj = {};
  obj[prop] = req.savedFileName;
  const objectModel = await model.findByIdAndUpdate(req.user.client_id, obj, {
    new: true,
    runValidators: true,
  });

  req.uploadedUser = objectModel;
  return next();
});

module.exports = {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver,
};
