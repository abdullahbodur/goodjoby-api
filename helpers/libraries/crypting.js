const crypto = require("crypto");

// == == == == == == == == == == == == == == == == == == == ==
// CRYPTING TEXT
// == == == == == == == == == == == == == == == == == == == ==

const crypting = (text) => {
  return crypto.createHash("SHA256").update(text).digest("hex");
};
 




module.exports = crypting
