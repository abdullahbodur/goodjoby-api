const errorHandlerWrapper = require("express-async-handler");
const {
  inputControl,
  comparePasswordInModel,
  stringEliminate,
} = require("../inputHelper/inputHelper");
const CustomError = require("../error/CustomError");
const sendMail = require("../libraries/sendMail");
const { sendJwtToUser } = require("../authorization/tokenHelpers");
const Admin = require("../../models/Admin");
const {
  googleTokenDecoder,
  facebookTokenDecoder,
} = require("../../middlewares/tokenControls/tokenControls");

const { generateUniqueUsername } = require("../modelHelpers/modelHelper");
const Client = require("../../models/Client");
const Expert = require("../../models/Expert");
const {
  verficiationMail,
  resetPassword,
} = require("../../templates/authTemplates");

// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const authRegister = errorHandlerWrapper(async (model, req, res, next) => {
  let { name, email, password, username } = req.body;

  try {
    if (!name || !email || !password)
      return next(
        new CustomError(
          "Some values are missing. Please check your values",
          400
        )
      );

    if (model !== Admin)
      username = username ? username : generateUniqueUsername(name);

    const objectModel = await model.create({
      name,
      email,
      password,
      username,
    });

    sendJwtToUser(objectModel, res);
  } catch (error) {
    console.log(error);
  }
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

  if (objectModel === null || !objectModel.password)
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

    // Change HTTP WHEN YOU ARE DEPLOYING !!!

    const resetPasswordUrl = `http://${DOMAIN_URI}${PORT}/api/${name}/resetpassword?resetPasswordToken=${token}`;

    try {
      await sendMail({
        from: process.env.SMTP_USER,
        to: objectModel.email,
        subject: "Reset Password",
        html: resetPassword(resetPasswordUrl),
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

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOADED PROFILE PHOTO SAVER
// == == == == == == == == == == == == == == == == == == == ==

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

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN IN OR SIGN UP BY USING SOCIAL ACCOUNT // GOOGLE // FACEBOOK
// == == == == == == == == == == == == == == == == == == == ==

const socialSignInUp = errorHandlerWrapper(async (req, res, next, model) => {
  /* 
    req.body properties : 
    --------------------
    => account_type
    => access_token
    --------------------
  */

  const body = req.body;

  if (!body.account_type || !body.access_token)
    return next(
      new CustomError("Invalid values are given. Please check your values", 400)
    );

  let result;

  if (body.account_type === "google")
    result = googleTokenDecoder(body.access_token);
  else if (body.account_type === "facebook") {
    result = await facebookTokenDecoder(body.access_token);
  } else
    return next(
      new CustomError("Account type is not founded. Please check again", 400)
    );

  if (!result.success)
    return next(
      new CustomError("Authorization error. Please check your identity", 400)
    );

  try {
    // check there is an user with that property
    const objectModel = await model.findOne(result.user);

    // if user is found create an access token and respond
    if (objectModel) sendJwtToUser(objectModel, res);
    // otherwise create new user by using token information
    else {
      const proposedUsername = stringEliminate(result.user.name);
      const { success, username } = await generateUniqueUsername(
        model,
        proposedUsername
      );
      if (!success)
        return next("Username is not created. Please try again", 400);
      const user = await model.create({ username, ...result.user });

      return sendJwtToUser(user, res);
    }
  } catch (error) {
    console.log(error);
    return next(new CustomError("Something wrong! Please try again", 400));
  }
});

// == == == == == == == == == == == == == == == == == == == ==
//   CREATE VERIFICATION NEW REQUEST
// == == == == == == == == == == == == == == == == == == == ==

const verificationNewRequest = errorHandlerWrapper(async (model, req, next) => {
  const { WEB_APP_PORT, WEB_APP_URI } = process.env;
  const user = req.user;

  if (!user.client_id)
    return next(new CustomError("Invalid token. Please try again", 400));

  const userObject = await model.findById(user.client_id);

  if (!userObject)
    return next(new CustomError("Invalid token. User is not found", 400));

  const token = userObject.getTokenFromUser();

  await userObject.save();

  // // Change HTTP WHEN YOU ARE DEPLOYING !!!

  const name =
    model === Client ? "client" : model === Expert ? "expert" : "team";

  const verificationUrl = `http://${WEB_APP_URI}${WEB_APP_PORT}/api/${name}/signup/verified?verificationToken=${token}`;

  try {
    await sendMail({
      from: process.env.SMTP_USER,
      to: userObject.email,
      subject: "Goodjoby Verification Mail",
      html: verficiationMail(verificationUrl, userObject.name),
    });
  } catch (error) {
    userObject.token = undefined;
    userObject.tokenExpire = undefined;

    await userObject.save();

    return next(new CustomError("Email could not send to client", 500));
  }

  req.user.email = userObject.email;

  return next();
});

// == == == == == == == == == == == == == == == == == == == ==
//   ACCEPT VERIFICATION TOKEN
// == == == == == == == == == == == == == == == == == == == ==

const acceptVerificationToken = errorHandlerWrapper(
  async (model, req, next) => {
    const { verificationToken } = req.query;

    if (!verificationToken)
      return next(
        new CustomError(
          "Invalid inputs are given. Please check your inputs",
          400
        )
      );

    const objectModel = await model.findOne({
      token: verificationToken,
      tokenExpire: { $gt: Date.now() },
    });

    if (!objectModel) {
      return next(new CustomError("Ops, token is invalid or expired", 400));
    }
    try {
      objectModel.creation_code = process.env.USER_VERIFICATED;
      objectModel.token = undefined;
      objectModel.tokenExpire = undefined;

      await objectModel.save();
    } catch (error) {
      return next(error);
    }

    return next();
  }
);
module.exports = {
  authRegister,
  authSignIn,
  profileOwnerAccessControl,
  forgotPassword,
  resetPasswordWithAuthHelper,
  uploadedPFSaver,
  socialSignInUp,
  verificationNewRequest,
  acceptVerificationToken,
};
