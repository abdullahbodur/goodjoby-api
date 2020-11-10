const bcrypt = require("bcryptjs");

// == == == == == == == == == == == == == == == == == == == ==
// INPUT CONTROL 
// == == == == == == == == == == == == == == == == == == == ==

const inputControl = (email, pass) => {
  return email && pass;
};
 
// == == == == == == == == == == == == == == == == == == == ==
// COMPARE PASSWORD USER ENTER WITH DATABASE HAS
// == == == == == == == == == == == == == == == == == == == ==


const comparePasswordInModel = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  inputControl,
  comparePasswordInModel,
};
