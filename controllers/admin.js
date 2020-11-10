const errorHandlerWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const createAdmin = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE NEW ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const loginAdmin = (req, res, next) => {};

const updateSubAdmin = errorHandlerWrapper(async (req, res, next) => {
  const admin = res.exist;

  for (const key in req.body) {
    if (admin[key]) {
      admin[key] = req.body[key];
    }
  }

  await admin.save();

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  BLOCK USER
// == == == == == == == == == == == == == == == == == == == ==

const blockUser = errorHandlerWrapper(async (req, res, next) => {
  const user = res.exist;
  user.blocked = !user.blocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User is ${user.blocked ? "blocked" : "unblocked"}`,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  BLOCK ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const blockAdmin = errorHandlerWrapper(async (req, res, next) => {
  const admin = res.exist;

  admin.blocked = !admin.blocked;
  await admin.save();

  res.status(200).json({
    success: true,
    message: `Admin is ${admin.blocked ? "blocked" : "unblocked"}`,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  DELETE ADMIN
// == == == == == == == == == == == == == == == == == == == ==

const deleteAdmin = errorHandlerWrapper(async (req, res, next) => {
  const admin = res.exist;

  await admin.remove();

  res.status(200).json({
    success: true,
  });
});




module.exports = {
  createAdmin,
  loginAdmin,
  updateSubAdmin, 
  blockUser,
  blockAdmin,
  deleteAdmin,
};
