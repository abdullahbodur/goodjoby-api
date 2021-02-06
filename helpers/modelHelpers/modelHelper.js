const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// == == == == == == == == == == == == == == == == == == == ==
// HASH PASSWORD CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const hashPassword = (next, object) => {
  if (!object.isModified("password")) {
    next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(object.password, salt, (err, hash) => {
      if (err) next(err);
      object.password = hash;
      next();
    });
  });
};

// == == == == == == == == == == == == == == == == == == == ==
// GENERATE JSONWEBTOKEN CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const generateJWTFromUser = (thisObject) => {
  const {
    JWT_EXPIRE_TIME,
    JWT_SECRET_KEY,
    JWT_ADMIN_TIME,
    JWT_ADMIN_KEY,
    COOKIE_EXPIRE,
    ADMIN_COOKIE_EXPIRE,
  } = process.env;

  const payload = {
    client_id: thisObject._id,
    goodjoby_ob: [
      thisObject.role == "client"
        ? "goodjoby.api.cli"
        : thisObject.role == "team"
        ? "goodjoby.api.tm"
        : thisObject.role == "expert"
        ? "goodjoby.api.exp"
        : thisObject.role == "admin"
        ? "goodjoby.api.adm"
        : undefined,
    ],
    scope: ["api.goodjoby.auth", "api.goodjoby.web"],
    auth_time: Date.now(),
    exp:
      Date.now() +
      parseInt(thisObject.stage ? ADMIN_COOKIE_EXPIRE : COOKIE_EXPIRE),
    aud: "api.goodjoby",
    role: "auth_user",
    device_id: "DEVICE ID",
    stg: thisObject.stage,
    cr_code: thisObject.creation_code,
  };

  const token = jwt.sign(
    payload,
    thisObject.stage ? JWT_ADMIN_KEY : JWT_SECRET_KEY
    // {
    //   expiresIn: thisObject.stage ? JWT_ADMIN_TIME : JWT_EXPIRE_TIME,
    // }
  );

  return token;
};

// == == == == == == == == == == == == == == == == == == == ==
// CREATE TOKEN FOR PASSWORD CLIENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const getResetPasswordTokenFromUser = (thisObject) => {
  const randomHexString = crypto.randomBytes(15);
  const { PASSWORD_RESET_EXPIRE } = process.env;
  const token = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

  thisObject.token = token;
  thisObject.tokenExpire = Date.now() + parseInt(PASSWORD_RESET_EXPIRE);

  return token;
};

// == == == == == == == == == == == == == == == == == == == ==
// CREATE TOKEN FOR ANYPURPOSE
// == == == == == == == == == == == == == == == == == == == ==

const getTokenForAnyPurpose = (arr, expire) => {
  const randomHexString = crypto.randomBytes(15);
  const token = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

  arr.push(token);
  arr.push(Date.now() + parseInt(expire));

  return arr;
};

// == == == == == == == == == == == == == == == == == == == ==
// USERNAME GENERATOR
// == == == == == == == == == == == == == == == == == == == ==

const generateUniqueUsername = (model, proposedUname) => {
  proposedUname = proposedUname.replace(/\s/g, "");

  return model
    .findOne({ username: proposedUname })
    .then((account) => {
      if (account) {
        proposedUname += Math.floor(Math.random() * 1000 + 1);

        return generateUniqueUsername(model, proposedUname);
      }

      return { success: true, username: proposedUname };
    })
    .catch((err) => {
      console.log(err);
      return { success: false, username: proposedUname };
    });
};

module.exports = {
  hashPassword,
  generateJWTFromUser,
  getResetPasswordTokenFromUser,
  getTokenForAnyPurpose,
  generateUniqueUsername,
};
