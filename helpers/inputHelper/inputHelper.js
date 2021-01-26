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

// == == == == == == == == == == == == == == == == == == == ==
// COMPARE PASSWORD USER ENTER WITH DATABASE HAS
// == == == == == == == == == == == == == == == == == == == ==

const stringEliminate = (string) => {
  return string.replace(/[^a-z\d]+/gi, "").toLowerCase();
};

module.exports = {
  inputControl,
  comparePasswordInModel,
  stringEliminate,
};
