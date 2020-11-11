const errorHandlerWrapper = require("express-async-handler");
const { dataControl } = require("../helpers/database/databaseControl");
const CustomError = require("../helpers/error/CustomError");
const sendMail = require("../helpers/libraries/sendMail");
const Work = require("../models/Work");
const ExpertRequest = require("../models/ExpertRequest");
const PendingWork = require("../models/PendingWork");
const {
  stateControl,
} = require("../helpers/controlHelpers/adminControlHelper");
const { populate } = require("../models/Work");

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
  const { STATE_CANCELED } = process.env;
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

  dataControl(work, next, "There is no Work with that id", 400);

  if (stateControl(work.state))
  return next(
    new CustomError(
      "This Work already finished, canceled or passive",
      400
    )
  );

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
    success: true,
    message: "Work canceled successfuly",
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL REQUEST
// == == == == == == == == == == == == == == == == == == == ==

const cancelRequest = errorHandlerWrapper(async (req, res, next) => {
  const { request_id } = req.body;
  const { STATE_CANCELED } = process.env;

  dataControl(request_id, next, "Please provide an Request Id", 400);

  const expertRequest = await ExpertRequest.findById(request_id).populate({
    path: "expert",
    select: "email",
  });

  dataControl(expertRequest, next, "There is no Offer with that id", 400);

  if (stateControl(expertRequest.state))
  return next(
    new CustomError(
      "This Offer already finished, canceled or passive",
      400
    )
  );

  const defState = expertRequest.state;

  try {
    expertRequest.state = parseInt(STATE_CANCELED);
    await expertRequest.save();

    const emailTemplate = `<h2>Your Offfer Canceled By Us</h2>
    <p>The offer with the code ${request_id} was closed by us. If something problem, contact us</p>`;

    await sendMail({
      from: process.env.SMTP_USER,
      to: expertRequest.expert.email,
      subject: "Your Offer Canceled By Us",
      html: emailTemplate,
    });
  } catch (error) {
    expertRequest.state = defState;
    await expertRequest.save();
    return next(error);
  }

  res
    .status(200)
    .json({ success: true, message: "Offer Canceled Successfuly" });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL PENDING WORK
// == == == == == == == == == == == == == == == == == == == ==

const cancelPendingWork = errorHandlerWrapper(async (req, res, next) => {
  const { pending_work_id } = req.body;
  const { STATE_CANCELED, STATE_PASSIVE, STATE_FINISHED } = process.env;

  dataControl(pending_work_id, next, "Please provide an Pending Work ID", 400);

  const pendingWork = await PendingWork.findById(pending_work_id).populate([
    {
      path: "client",
      select: "email name",
    },
    {
      path: "expert_requests",
      populate: {
        path: "expert",
        select: "email name",
      },
      select:
        "-is_accepted -messages -_id -title -content -price -createdAt -__v",
    },
  ]);

  dataControl(pendingWork, next, "There is no Pending Work with that id", 400);

  if (stateControl(pendingWork.state))
    return next(
      new CustomError(
        "This Pending Work already finished, canceled or passive",
        400
      )
    );

  const defState = pendingWork.state;

  try {
    pendingWork.state = parseInt(STATE_CANCELED);
    await pendingWork.save();

    if (pendingWork.expert_requests.length > 0) {
      let requestMailList = [];

      pendingWork.expert_requests.forEach((expertRequest) => {
        if (
          ![
            parseInt(STATE_PASSIVE),
            parseInt(STATE_FINISHED),
            parseInt(STATE_CANCELED),
          ].includes(expertRequest.state)
        )
          requestMailList.push(expertRequest.expert.email);
      });

      const emailTemplate = `<h2>Your Requested Pending Work Canceled By Us</h2>
      <p>Hello !,\nThe Pending Work with the code ${pending_work_id} was closed by us. If something problem, contact us</p>`;

      await sendMail({
        from: process.env.SMTP_USER,
        to: requestMailList,
        subject: "Your Requested Pending Work Canceled By Us",
        html: emailTemplate,
      });
    }

    const emailTemplate = `<h2>Your Pending Work Canceled By Us</h2>
    <p>Hello ${pendingWork.client.name},\nThe Pending Work with the code ${pending_work_id} was closed by us. If something problem, contact us</p>`;

    await sendMail({
      from: process.env.SMTP_USER,
      to: pendingWork.client.email,
      subject: "Your Pending Work Canceled By Us",
      html: emailTemplate,
    });
  } catch (error) {
    pendingWork.state = defState;
    await pendingWork.save();
    return next(error);
  }

  res
    .status(200)
    .json({ success: true, message: "Pending Work Canceled Successfuly" });
});

module.exports = {
  createAdmin,
  loginAdmin,
  updateSubAdmin,
  blockUser,
  blockAdmin,
  deleteAdmin,
  cancelWork,
  cancelRequest,
  cancelPendingWork,
};
