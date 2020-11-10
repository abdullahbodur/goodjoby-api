const errorHandlerWrapper = require("express-async-handler");
const PendingWork = require("../../models/PendingWork");

const propWorks = errorHandlerWrapper(async (req, res, next) => {
  const positions = req.user.userObject.job.positions;

  let propWorks = [];

  if (positions.length > 0) {
    propWorks = await PendingWork.find({
      service_id: { $in: positions },
      state: {  
        $in: [
          parseInt(process.env.STATE_CREATED),
          parseInt(process.env.STATE_ACTIVE),
        ],
      },
      expert_requests : {$nin : req.user.userObject.offers},
      expireAt: { $gt: Date.now() },
    });
  }

  req.propWorks = propWorks;
  next();
});

module.exports = propWorks;
