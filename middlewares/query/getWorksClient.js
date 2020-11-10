const errorHandlerWrapper = require("express-async-handler");
const {
  usePopulation,
  usePagination,
  useSelectField,
} = require("./queryHelper");

const getWorksClient = function (model, options, field) {
  return errorHandlerWrapper(async (req, res, next) => {
    let query = model.find({ 
      client: req.user.id,
      state: {
        $nin: [
          parseInt(process.env.STATE_PASSIVE),
          parseInt(process.env.STATE_FINISHED),
        ],
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
