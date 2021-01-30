const errorHandlerWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const ExpertRequest = require("../../models/ExpertRequest");
const PendingWork = require("../../models/PendingWork");
const Work = require("../../models/Work");
const {
  getTokenForAnyPurpose,
} = require("../../helpers/modelHelpers/modelHelper");
const sendMail = require("../../helpers/libraries/sendMail");
const { dataControl } = require("../../helpers/database/databaseControl");

const JobInfo = require("../../models/JobInfo");
// == == == == == == == == == == == == == == == == == == == ==
//  CREATE  OFFER - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const crExpertRequest = (isTeam) =>
  errorHandlerWrapper(async (req, res, next) => {
    const data = req.body;
    const pendingWorkID = req.params.id;
    const pendingWork = await PendingWork.findById(pendingWorkID).populate(
      "expert_requests"
    );

    dataControl(pendingWork, next, "There is no work with that id", 400);

    // IF Expert has this service control

    if (!req.user.userObject.job.positions.includes(pendingWork.service_id)) {
      return next(
        new CustomError("Your services do not match this pending work", 403)
      );
    }

    if (
      pendingWork.expert_requests.length > 0 &&
      pendingWork.expert_requests.filter(
        (e) =>
          e.expert == req.user.client_id &&
          e.is_team ==
            (req.user.userObject.goodjoby_ob.includes("goodjoby.api.tm")
              ? true
              : false)
      ).length > 0
    )
      return next(new CustomError("You are already offer this work", 400));

    const expertRequest = await ExpertRequest.create({
      ...data,
      expert: req.user.client_id,
      is_team: isTeam,
      expert_type: isTeam ? "Team" : "Expert",
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
//  CANCEL ANY OFFER - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const clExpertRequest = errorHandlerWrapper(async (req, res, next) => {
  const { req_id } = req.params;

  const { STATE_CREATED, STATE_ACTIVE, STATE_CANCELED } = process.env;

  const expertRequest = await ExpertRequest.findById(req_id);

  dataControl(expertRequest, next, "There is no offer with that id", 400);

  if (
    ![parseInt(STATE_ACTIVE), parseInt(STATE_CREATED)].includes(
      expertRequest.state
    )
  )
    return next(new CustomError("This offer already succed or canceled"));

  try {
    expertRequest.state = parseInt(STATE_CANCELED);
    expertRequest.save();
  } catch (error) {
    expertRequest.state = parseInt(STATE_CREATED);
    expertRequest.save();
    return next(error);
  }

  return next();
});

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL  WORK - TEAM - EXPERT - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWrk = (isClient, modelName) =>
  errorHandlerWrapper(async (req, res, next) => {
    const { DOMAIN_URI, PORT } = process.env;
    const { work_id } = req.params;
    const vr = {};

    isClient
      ? (vr["client"] = req.user.client_id)
      : (vr["expert"] = req.user.client_id);

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

    try {
      await sendMail({
        from: process.env.SMTP_USER,
        to: isClient ? work.expert.email : work.client.email,
        subject: isClient
          ? "Your Work Will Cancel!"
          : "Your Work Request Will Cancel!",
        html: cancelWork(
          isClient,
          work.client.name,
          resetPasswordUrl,
          modelName,
          work.expert.name
        ),
      });
    } catch (error) {
      work.cancel_token = undefined;
      work.cancel_token_expire = undefined;

      await work.save();

      return next(new CustomError("Email could not send to client", 500));
    }
    next();
  });

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - TEAM - EXPERT - CLIENT
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

// == == == == == == == == == == == == == == == == == == == ==
//  UPGRADE - FINISIHED - PERCENT - TEAM - EXPERT
// == == == == == == == == == == == == == == == == == == == ==

const upgradeFinishedPrcnt = () =>
  errorHandlerWrapper(async (req, res, next) => {
    const { work_id } = req.params;
    let { finished_percent } = req.body;
    const { DOMAIN_URI, PORT } = process.env;

    finished_percent = parseInt(finished_percent);

    const work = await Work.findOneAndUpdate(
      {
        _id: work_id,
        expert: req.user.client_id,
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

      try {
        await sendMail({
          from: process.env.SMTP_USER,
          to: work.client.email,
          subject: "Your Work Has Been Finished!",
          html: upgradeWorkPercent(work.expert.name, finishedWorkAcceptUrl),
        });
      } catch (error) {
        work.finished_token = undefined;
        work.finished_token_expire = undefined;

        await work.save();

        return next(new CustomError("Email could not send to client", 500));
      }
    }

    req.work = work;
    next();
  });

const addNewPosition = (isTeam) =>
  errorHandlerWrapper(async (req, res, next) => {
    const { sector_id, position } = req.body;
    const expert = req.user.userObject;

    dataControl(sector_id, next, "Please provide an data", 400);
    dataControl(position, next, "Please provide an data", 400);

    const job = await JobInfo.findOne({
      _id: position,
      sector_id: sector_id,
    });

    dataControl(job, next, "Position not found", 400);

    const defJob = expert.job;

    if (expert.job.sector_id) {
      if (expert.job.sector_id != sector_id)
        return next(new CustomError("Sectors are not matched", 400));
    } else expert.job.sector_id = sector_id;

    if (expert.job.positions.includes(position))
      return next(new CustomError("This position already added", 400));

    try {
      expert.job.positions.push(position);
      await expert.save();

      job[isTeam ? "teams" : "experts"].push(req.user.client_id);
      job[isTeam ? "team_count" : "worker_count"]++;
      await job.save();
    } catch (error) {
      expert.job = defJob;
      await expert.save();
    }

    return next();
  });

module.exports = {
  crExpertRequest,
  clExpertRequest,
  cancelWrk,
  cancelWrkAccept,
  upgradeFinishedPrcnt,
  addNewPosition,
};
