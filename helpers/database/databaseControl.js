const CustomError = require("../error/CustomError");

const dataControl = (data, next, message, statusCode) => {
  if (!data) return next(new CustomError(message, statusCode));
};

const multiDataControl = (dataList, next, message, statusCode) => {
  for (let index = 0; index < dataList.length; index++) {
    if (!dataList[index]) return next(new CustomError(message, statusCode));
  }
}; 

module.exports = {
  dataControl,
  multiDataControl
};
