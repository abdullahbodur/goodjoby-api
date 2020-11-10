    

const CustomError = require("../../helpers/error/CustomError");

// == == == == == == == == == == == == == == == == == == == ==
//  EMPTY OBJECT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const dataControl = (req, res, next) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return next(new CustomError("Please send a data for process", 400));
  } 

  return next();
};

module.exports = dataControl;
