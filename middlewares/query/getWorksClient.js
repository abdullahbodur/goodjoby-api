const errorHandlerWrapper = require("express-async-handler");
const {
  usePopulation,
  usePagination,
  useSelectField,
} = require("./queryHelper");

const getWorksClient = function (model, options, field) {
  return errorHandlerWrapper(async (req, res, next) => {
    const { STATE_CREATED, STATE_ACTIVE } = process.env;

    let query = model.find({
      client: req.user.client_id,
      state: {
        $in: [parseInt(STATE_CREATED), parseInt(STATE_ACTIVE)],
      },
    });

    // pagination

    if (options && options.population) {
      query = usePopulation(query, options.population);
    }

    // only selected field

    query = useSelectField(query, field);

    // // pagination

    const total = await model.countDocuments();

    resultPagenation = await usePagination(req, query, false, total);

    query = resultPagenation.query;

    const resultData = await query;

    res.result = {
      success: true,
      count: resultData.length,
      data: resultData,
    };

    next();
  });
};

module.exports = getWorksClient;
