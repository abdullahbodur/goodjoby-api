const errorHandlerWrapper = require("express-async-handler");
const { dataControl } = require("../../helpers/database/databaseControl");
const ExpertRequest = require("../../models/ExpertRequest");
const PendingWork = require("../../models/PendingWork");
const Work = require("../../models/Work");

const { usePagination } = require("./queryHelper");

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL - PROP WORKS - EXPERT - TEAM
// == == == == == == == == == == == == == == == == == == == ==

const propWorks = errorHandlerWrapper(async (req, res, next) => {
  const positions = req.user.userObject.job.positions;

  let propWorks = [];

  if (positions.length > 0) {
    const qry = {
      service_id: { $in: positions },
      state: {
        $in: [
          parseInt(process.env.STATE_CREATED),
          parseInt(process.env.STATE_ACTIVE),
        ],
      },
      expert_requests: { $nin: req.user.userObject.offers },
      expireAt: { $gt: Date.now() },
    };

    propWorks = PendingWork.find(qry);

    const total = await PendingWork.countDocuments(qry);

    const pagenationResult = usePagination(req, propWorks, true, total);

    propWorks = await pagenationResult.query;

    req.positionStatus = 1;
  } else req.positionStatus = 0;

  req.propWorks = propWorks;
  next();
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET REQUESTED WORKS - EXPERT - TEAM
// == == == == == == == == == == == == == == == == == == == ==

const getRequestedWorks = errorHandlerWrapper(async (req, res, next) => {
  const { STATE_CREATED, STATE_ACTIVE } = process.env;

  const qry = {
    expert: req.user.client_id,
    state: {
      $in: [parseInt(STATE_CREATED), parseInt(STATE_ACTIVE)],
    },
  };

  let pendingRequests = ExpertRequest.find(qry);

  const count = await ExpertRequest.countDocuments(qry);

  paginationResult = usePagination(req, pendingRequests, true, count);

  pendingRequests = await paginationResult.query;

  res.status(200).json({
    success: true,
    data: pendingRequests,
    pagenation: paginationResult.pagenation,
    startIndex: paginationResult.startIndex,
    lastOne: paginationResult.lastOne,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL WORKS - EXPERT - TEAM
// == == == == == == == == == == == == == == == == == == == ==

const getAllWorks = errorHandlerWrapper(async (req, res, next) => {
  const works = await Work.find({
    expert: req.user.client_id,
    state: {
      $in: [
        parseInt(process.env.STATE_CREATED),
        parseInt(process.env.STATE_ACTIVE),
      ],
    },
  });

  res.status(200).json({
    success: true,
    data: works,
  });
});

module.exports = { propWorks, getRequestedWorks, getAllWorks };
