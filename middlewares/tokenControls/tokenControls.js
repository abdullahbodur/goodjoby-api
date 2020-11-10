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
const Company = require("../../models/Company");

const {
  dataControl,
  multiDataControl,
} = require("../../helpers/database/databaseControl");

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
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    return next();
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  PROFILE ACCESS TOKEN CONTROL COMPANY - CLIENT - EXPER
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
      id: decoded.id,
      name: decoded.name,
    };
    return next();
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN ROLE CONTROL - COMPANY - EXPERT - CLIENT ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const tokenRoleControl = (role_name) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (role_name !== role) {
      return next(new CustomError("Authorization is invalid ", 403));
    }
    return next();
  };
};


// == == == == == == == == == == == == == == == == == == == ==
//  BLOCKED CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const blockedControl = (model) =>
  errorHandlerWrapper(async (req, res, next) => {
    
    
    if (!req.user.id) return next(new CustomError("Please provide an id", 400));




    const objectModel = await model.findOne({
      id: req.user.id,
      blocked: false,
    });

    if (!objectModel)
      return next(
        new CustomError("This user has been banned for any reason", 403)
      );
 
    req.user.userObject = userObject;
  });

// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN ROLE CONTROL - COMPANY - EXPERT - CLIENT ADMIN
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
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
      stage: decoded.stage,
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
    if (!stage_codes.includes(tokenData.stage)) {
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
        modelName == "company"
          ? Company
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

    next();
  });

const adminAuthorityControl = (req, res, next) => {
  if (res.exist.stage >= req.user.stage)
    return next(new CustomError("Your authorization is not supported", 400));
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
};
