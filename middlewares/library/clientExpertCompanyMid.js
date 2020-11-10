const errorHandlerWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const ExpertRequest = require("../../models/ExpertRequest");
const PendingWork = require("../../models/PendingWork");
const Work = require("../../models/Work");
const {
  getTokenForAnyPurpose,
} = require("../../helpers/modelHelpers/modelHelper");
const sendMail = require("../../helpers/libraries/sendMail");
const Expert = require("../../models/Expert");

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE  OFFER - COMPANY - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const crExpertRequest = (isCompany) =>
  errorHandlerWrapper(async (req, res, next) => {
    const data = req.body;
    const pendingWorkID = req.params.id;
    const pendingWork = await PendingWork.findById(pendingWorkID).populate(
      "expert_requests"
    );

    if (!pendingWork) {
      return next(new CustomError("There is no work with that id", 400));
    }

    // IF Expert has this service control

    if (!req.user.userObject.job.positions.includes(pendingWork.service_id)) {
      return next(new CustomError("Authorization is invalid", 403));
    }

    if (
      pendingWork.expert_requests.length > 0 &&
      pendingWork.expert_requests.filter(
        (e) =>
          e.expert == req.user.id ||
          e.is_company == (req.user.userObject.role === "company" ? true : false)
      )
    ) {
      return next(new CustomError("You are already offer this work", 400));
    }

    const expertRequest = await ExpertRequest.create({
      ...data,
      expert: req.user.id,
      is_company: isCompany,
      expert_type: isCompany ? "Company" : "Expert",
      pending_work_id: pendingWorkID,
    });

    try {
      pendingWork.expert_requests.push(expertRequest._id);
      req.user.userObject.offers.push(expertRequest._id);

      await req.user.userObject.save();
      await pendingWork.save();

      req.expertRequest = expertRequest;

      next();
    } catch (error) {
      expertRequest.remove();

      pendingWork.expert_requests.splice(
        pendingWork.expert_requests.indexOf(expertRequest._id)
      );
      req.user.userObject.offers.splice(
        req.user.userObject.offers.indexOf(expertRequest._id)
      );

      await req.user.userObject.save();
      await pendingWork.save();

      next(error);
    }
  });

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL ANY OFFER - COMPANY - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const clExpertRequest = errorHandlerWrapper(async (req, res, next) => {
  const { req_id } = req.params;


  const expertRequest = await ExpertRequest.findById(req_id);

  if (!expertRequest) {
    return next(new CustomError("There is no offer with that id", 400));
  }

  if (
    expertRequest.state !==
    (parseInt(process.env.STATE_CREATED) || parseInt(process.env.STATE_ACTIVE))
  ) { 
    return next(new CustomError("This offer already succed or canceled"));
  }

  try {
    expertRequest.state = parseInt(process.env.STATE_CANCELED);
    expertRequest.save();
  } catch (error) {
    expertRequest.state = parseInt(process.env.STATE_CREATED);
    expertRequest.save();
    return next(error);
  }

  return next();
});

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL  WORK - COMPANY - EXPERT - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWrk = (isClient, modelName) =>
  errorHandlerWrapper(async (req, res, next) => {
    const { DOMAIN_URI, PORT } = process.env;
    const { work_id } = req.params;
    const vr = {};

    isClient ? (vr["client"] = req.user.id) : (vr["expert"] = req.user.id);

    const work = await Work.findOne({
      _id: work_id,
      ...vr,
      state: {
        $nin: [
          parseInt(process.env.STATE_CANCELED),
          parseInt(process.env.STATE_PASSIVE),
        ],
      },
    }).populate([
      {
        path: "expert",
        select: "name email",
      },
      {
        path: "client",
        select: "name email",
      },
    ]);

    if (!work) {
      return next(
        new CustomError(
          "There is no work with that id Or Already expired work",
          400
        )
      );
    }

    const arr = getTokenForAnyPurpose([], process.env.CANCEL_TOKEN_EXPIRE);
    work.cancel_token = arr[0];
    work.cancel_token_expire = arr[1];
    await work.save();
    const resetPasswordUrl = `http://${DOMAIN_URI}${PORT}/api/${modelName}/cancel_work_accept/${work_id}?cancelWorkToken=${token}`;

    console.log(resetPasswordUrl);

    const emailTemplate = isClient
      ? `<h2> Your Work Will Cancel! </h2>
    <p> Your Client ${work.client.name} has been created a request about cancelling!
    If you aware this happening, You have to click link which is in below.
    Accept link :  <a href= '${resetPasswordUrl}' target='_blank'>HERE!</a> \n This link will expire an hour </p>`
      : `<h2> Your Work Request Will Cancel! </h2>
    <p> Your ${modelName} ${work.expert.name} has been created a request about cancelling!
    If you aware this happening, You have to click link which is in below.
    Accept link :  <a href= '${resetPasswordUrl}' target='_blank'>HERE!</a> \n This link will expire an hour </p>`;

    try {
      await sendMail({
        from: process.env.SMTP_USER,
        to: isClient ? work.expert.email : work.client.email,
        subject: isClient
          ? "Your Work Will Cancel!"
          : "Your Work Request Will Cancel!",
        html: emailTemplate,
      });
    } catch (error) {
      objectModel.cancel_token = undefined;
      objectModel.cancel_token_expire = undefined;

      await objectModel.save();

      return next(new CustomError("Email could not send to client", 500));
    }

    console.log(work);
    next();
  });

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - COMPANY - EXPERT - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWrkAccept = errorHandlerWrapper(async (req, res, next) => {
  const token = req.query.cancelWorkToken;
  const { work_id } = req.params;

  if (!token || !work_id)
    return next(new CustomError("Ups!, You forgot something", 400));

  const work = await Work.findOne({
    _id: work_id,
    cancel_token: token,
    cancel_token_expire: { $gt: Date.now() },
    state: {
      $nin: [
        parseInt(process.env.STATE_CANCELED),
        parseInt(process.env.STATE_PASSIVE),
      ],
    },
  });

  if (!work)
    return next(
      new CustomError("There is no work with your given information", 400)
    );

  work.state = parseInt(process.env.STATE_PASSIVE);
  work.cancel_token = undefined;
  work.cancel_token_expire = undefined;
  await work.save();

  next();
});

const upgradeFinishedPrcnt = () =>
  errorHandlerWrapper(async (req, res, next) => {
    const { work_id } = req.params;
    let { finished_percent } = req.body;
    const { DOMAIN_URI, PORT } = process.env;

    finished_percent = parseInt(finished_percent);

    const work = await Work.findOneAndUpdate(
      {
        _id: work_id,
        expert: req.user.id,
        finished_percent: { $lt: finished_percent },
      },
      {
        $set: { finished_percent: finished_percent },
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .populate([
        {
          path: "client",
          select: "email",
        },
        {
          path: "expert",
          select: "name",
        },
      ])
      .select("_id expert_type state finished_percent");

    if (!work) {
      return next(new CustomError("Ops!, there is something wrong!", 400));
    }

    if (finished_percent === 100) {
      const arr = getTokenForAnyPurpose([], process.env.FINISHED_TOKEN_EXPIRE);
      work.finished_token = arr[0];
      work.finished_token_expire = arr[1];

      await work.save();

      const finishedWorkAcceptUrl = `http://${DOMAIN_URI}${PORT}/api/client/accept_finish_work/${work_id}?finishedWorkToken=${work.finished_token}`;

      const emailTemplate = `<h2> Your Work Request Finished! </h2>
    <p>${work.expert.name} has been finished your work!
    If you are satisfied this service, You have to click link which is in below to accept to finish your work!.
    Accept link :  <a href= '${finishedWorkAcceptUrl}' target='_blank'>HERE!</a> \n This link will expire an hour </p>`;

      try {
        await sendMail({
          from: process.env.SMTP_USER,
          to: work.client.email,
          subject: "Your Work Has Been Finished!",
          html: emailTemplate,
        });
      } catch (error) {
        objectModel.finished_token = undefined;
        objectModel.finished_token_expire = undefined;

        await objectModel.save();

        return next(new CustomError("Email could not send to client", 500));
      }
    }

    req.work = work;
    next();
  });

module.exports = {
  crExpertRequest,
  clExpertRequest,
  cancelWrk,
  cancelWrkAccept,
  upgradeFinishedPrcnt,
};
