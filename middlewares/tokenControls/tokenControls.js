const jwt = require("jsonwebtoken");
const errorHandlerWrapper = require("express-async-handler");
const {
  isTokenIncluded,
  getTokenFromCookie,
} = require("../../helpers/authorization/tokenHelpers");
const CustomError = require("../../helpers/error/CustomError");
const Admin = require("../../models/Admin");
const Expert = require("../../models/Expert");
const Client = require("../../models/Client");
const Team = require("../../models/Team");
const { dataControl } = require("../../helpers/database/databaseControl");
const fetch = require("node-fetch");

const FACEBOOK_TOKEN_DECODE =
  "https://graph.facebook.com/me?fields=id,email,name&access_token=";
// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN CONTROL IF IT SENDED
// == == == == == == == == == == == == == == == == == == == ==

const tokenControl = errorHandlerWrapper((req, res, next) => {
  const { jwt_secret_key_here } = process.env;

  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorized, Please login an account", 401)
    );
  }

  const token = getTokenFromCookie(req);

  jwt.verify(token, jwt_secret_key_here, (err, decoded) => {
    if (err) next(new CustomError("Your Authorize is invalid", 401));
    req.user = {
      client_id: decoded.client_id,
      goodjoby_ob: decoded.goodjoby_ob,
      scope: decoded.scope,
      auth_time: decoded.auth_time,
      exp: decoded.exp,
      aud: decoded.aud,
      role: decoded.role,
      device_id: decoded.device_id,
    };
    return next();
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  PROFILE ACCESS TOKEN CONTROL TEAM - CLIENT - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const profileTokenControl = errorHandlerWrapper((req, res, next) => {
  const { jwt_secret_key_here } = process.env;

  if (!isTokenIncluded(req)) {
    return next();
  }
  const token = getTokenFromCookie(req);

  jwt.verify(token, jwt_secret_key_here, (err, decoded) => {
    if (err) next(new CustomError("Your Authorize is invalid", 401));
    req.user = {
      client_id: decoded.client_id,
      goodjoby_ob: decoded.goodjoby_ob,
      scope: decoded.scope,
      auth_time: decoded.auth_time,
      exp: decoded.exp,
      aud: decoded.aud,
      role: decoded.role,
      device_id: decoded.device_id,
    };
    return next();
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN ROLE CONTROL - TEAM - EXPERT - CLIENT ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const tokenRoleControl = (role_name) => {
  return (req, res, next) => {
    const { goodjoby_ob } = req.user;

    if (!goodjoby_ob.includes(role_name))
      return next(new CustomError("Authorization is invalid ", 403));

    return next();
  };
};

// == == == == == == == == == == == == == == == == == == == ==
//  BLOCKED CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const blockedControl = (model) =>
  errorHandlerWrapper(async (req, res, next) => {
    if (!req.user.client_id)
      return next(new CustomError("Please provide an id", 400));

    const objectModel = await model.findById(req.user.client_id);

    if (objectModel.blocked)
      return next(
        new CustomError("This user has been banned for any reason", 403)
      );

    req.user.userObject = objectModel;

    return next();
  });

// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN ROLE CONTROL - TEAM - EXPERT - CLIENT ADMIN
// == == == == == == == == == == == == == == == == == == == ==

// const modelAccess = (model) => {
//   return errorHandlerWrapper(async (req, res, next) => {
//     const { id } = req.user;

//     const objectModel = await model.findById(id);

//     dataControl(
//       objectModel,
//       next,
//       "Authentication error please try again",
//       403
//     );

//     if (objectModel.blocked)
//       next(new CustomError("This user has been banned for any reason", 400));

//     req.userResult = objectModel;
//     next();
//   });
// };

// == == == == == == == == == == == == == == == == == == == ==
//  ADMIN TOKEN CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const adminTokenControl = errorHandlerWrapper(async (req, res, next) => {
  const { JWT_ADMIN_KEY } = process.env;

  if (!isTokenIncluded(req)) {
    return next(new CustomError("You are not authorized", 401));
  }

  const token = getTokenFromCookie(req);

  jwt.verify(token, JWT_ADMIN_KEY, async (err, decoded) => {
    if (err) next(new CustomError("Authorize is invalid", 401));
    req.user = {
      client_id: decoded.client_id,
      goodjoby_ob: decoded.goodjoby_ob,
      scope: decoded.scope,
      auth_time: decoded.auth_time,
      exp: decoded.exp,
      aud: decoded.aud,
      role: decoded.role,
      device_id: decoded.device_id,
      stg: decoded.stg,
    };

    return next();
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  ADMIN STAGE CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const adminStageControl = (stage_codes) => {
  return errorHandlerWrapper(async (req, res, next) => {
    const tokenData = req.user;
    console.log(tokenData);
    if (!stage_codes.includes(tokenData.stg)) {
      return next(new CustomError("Authorize is invalid"), 403);
    }

    return next();
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  ADMIN EXISTS CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const existControl = (model) =>
  errorHandlerWrapper(async (req, res, next) => {
    const { id } = req.params;

    if (!model) {
      const modelName = req.body.role;

      model =
        modelName == "team"
          ? Team
          : modelName == "client"
          ? Client
          : modelName == "expert"
          ? Expert
          : undefined;

      dataControl(
        model,
        next,
        "Please provide a role for will block any user",
        400
      );
    }

    dataControl(id, next, "Please required an ID", 400);

    const objectModel = await model.findById(id);

    dataControl(objectModel, next, "There is no data with that id", 400);

    res.exist = objectModel;

    return next();
  });

// == == == == == == == == == == == == == == == == == == == ==
//  ADMIN AUTHORITY CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==
const adminAuthorityControl = (req, res, next) => {
  if (res.exist.stage >= req.user.stg)
    return next(new CustomError("Your authorization is not supported", 400));
  return next();
};

// == == == == == == == == == == == == == == == == == == == ==
//  GOOGLE ACCOUNT TOKEN DECODER
// == == == == == == == == == == == == == == == == == == == ==

const googleTokenDecoder = (access_token) => {
  try {
    const payload = jwt.decode(access_token);

    let user = {};

    if (payload && payload.email) {
      user["email"] = payload.email;

      user["name"] = payload.name;

      user["google_id"] = payload.sub;

      return { success: true, user };
    }

    return { success: false, user };
  } catch (error) {
    console.log(error);
  }
};

// == == == == == == == == == == == == == == == == == == == ==
//  FACEBOOK ACCOUNT ACCESS TOKEN DECODER
// == == == == == == == == == == == == == == == == == == == ==

const facebookTokenDecoder = async (access_token) => {
  try {
    const URI = FACEBOOK_TOKEN_DECODE + access_token;

    let user = {};

    const decoded = await fetch(URI);
    const response = await decoded.json();

    console.log(response);

    if (response.error) return { success: false, user };

    user["email"] = response.email;
    user["name"] = response.name;
    user["facebook_id"] = response.id;

    return { success: true, user };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  tokenControl,
  profileTokenControl,
  blockedControl,
  tokenRoleControl,
  // modelAccess,
  adminStageControl,
  adminTokenControl,
  existControl,
  adminAuthorityControl,
  googleTokenDecoder,
  facebookTokenDecoder,
};
