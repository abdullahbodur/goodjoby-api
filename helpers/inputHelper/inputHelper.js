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

// == == == == == == == == == == == == == == == == == == == ==
// IGNORE SELECT CREATIOR
// == == == == == == == == == == == == == == == == == == == ==

const ignoreSelectGenerator = (ignore) => {
  let select = "";

  if (ignore) {
    const ignored = ignore.split(",");

    for (const ignoreI of ignored) {
      select += " -" + ignoreI;
    }
  }
  return select;
};

module.exports = {
  inputControl,
  comparePasswordInModel,
  stringEliminate,
  ignoreSelectGenerator,
};
