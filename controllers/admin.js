const errorHandlerWrapper = require("express-async-handler");
const { dataControl } = require("../helpers/database/databaseControl");
const CustomError = require("../helpers/error/CustomError");
const sendMail = require("../helpers/libraries/sendMail");
const Work = require("../models/Work");
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

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK
// == == == == == == == == == == == == == == == == == == == ==

const cancelWork = errorHandlerWrapper(async (req, res, next) => {
  const { work_id } = req.body;
  const { STATE_PASSIVE, STATE_FINISHED, STATE_CANCELED } = process.env;
  dataControl(work_id, next, "Please provide an work ID", 400);

  const work = await Work.findById(work_id).populate([
    {
      path: "expert",
      select: "name email",
    },
    {
      path: "client",
      select: "name email",
    },
  ]);

  console.log(work.state)
  if (
    [
      parseInt(STATE_PASSIVE),
      parseInt(STATE_FINISHED),
      parseInt(STATE_CANCELED),
    ].includes(work.state)
  )return next(new CustomError("This Work already finished or blocked or passive", 400));

  const defState = work.state;
  try {
    work.state = parseInt(STATE_CANCELED);
    await work.save();

    const emailTemplate = `<h2>Work Canceled By Us</h2>
    <p>The job with the code ${work_id} was closed by us. If something problem, contact us</p>`;

    await sendMail({
      from: process.env.SMTP_USER,
      to: work.expert.email,
      subject: "Work Canceled By Us",
      html: emailTemplate,
    });

    await sendMail({
      from: process.env.SMTP_USER,
      to: work.client.email,
      subject: "Work Canceled By Us",
      html: emailTemplate,
    });

  } catch (error) {
    work.state = defState;
    await work.save();
    return next(error);
  }

  res.status(200).json({
    success : true,
    message : "Work canceled successfuly"
  })
});

module.exports = {
  createAdmin,
  loginAdmin,
  updateSubAdmin,
  blockUser,
  blockAdmin,
  deleteAdmin,
  cancelWork,
};
