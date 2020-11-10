const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// == == == == == == == == == == == == == == == == == == == ==
// HASH PASSWORD CLIENT - COMPANY - EXPER
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
// GENERATE JSONWEBTOKEN CLIENT - COMPANY - EXPER
// == == == == == == == == == == == == == == == == == == == ==

const generateJWTFromUser = (thisObject) => {
  const {
    JWT_EXPIRE_TIME,
    jwt_secret_key_here,
    JWT_ADMIN_TIME,
    JWT_ADMIN_KEY,
  } = process.env;

  
  
  const payload = {
    id: thisObject._id,
    name: thisObject.name ,
    role: thisObject.role,
    stage : thisObject.stage ? thisObject.stage  : undefined
  };

  const token = jwt.sign(
    payload,
    thisObject.stage ? JWT_ADMIN_KEY : jwt_secret_key_here,
    {
      expiresIn: thisObject.stage ? JWT_ADMIN_TIME : JWT_EXPIRE_TIME,
    }
  );

  return token;
};

// == == == == == == == == == == == == == == == == == == == ==
// CREATE TOKEN FOR PASSWORD CLIENT - COMPANY - EXPER
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

module.exports = {
  hashPassword,
  generateJWTFromUser,
  getResetPasswordTokenFromUser,
  getTokenForAnyPurpose,
};
