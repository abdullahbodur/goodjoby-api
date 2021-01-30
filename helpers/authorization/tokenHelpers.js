const { generateJWTFromUser } = require("../modelHelpers/modelHelper");

// == == == == == == == == == == == == == == == == == == == ==
//  SEND JSON WEB TOKEN TO USER
// == == == == == == == == == == == == == == == == == == == ==

const sendJwtToUser = (user, res) => {
  const { COOKIE_EXPIRE, NODE_ENV, ADMIN_COOKIE_EXPIRE } = process.env;
 
  const token = generateJWTFromUser(user);
   
  res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: NODE_ENV === "development" ? false : true,
      expires: new Date(
        Date.now() + parseInt(user.stage ? ADMIN_COOKIE_EXPIRE : COOKIE_EXPIRE)
      ), // expire Time in Hours
    })
    .json({
      success: true,
      accessToken: token,
      name: user.name,
      role: user.role,
      email: user.email,
      stage : user.stage || undefined,
      cr_code : user.creation_code || undefined
    });
};

// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN CONTROL IF TOKEN SENDED
// == == == == == == == == == == == == == == == == == == == ==

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
  );
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET TOKEN FROM COOKIE IF IS EXISTS
// == == == == == == == == == == == == == == == == == == == ==

const getTokenFromCookie = (req) => {
  return req.headers.authorization.split(" ")[1];
};

module.exports = {
  sendJwtToUser,
  isTokenIncluded,
  getTokenFromCookie,
};
