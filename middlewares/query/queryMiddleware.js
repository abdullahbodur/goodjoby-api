const errorHandlerWrapper = require("express-async-handler");
const {
  usePopulation,
  searchControl,
  usePagination,
  useSelectField,
} = require("./queryHelper");

const queryMiddlware = function (model, searchField, options,field) {
  return errorHandlerWrapper(async (req, res, next) => {
    let query = model.find();

    // pagination
 
    if (options && options.population) {
      query = usePopulation(query, options.population);
    }

    // search filter

    query = searchControl(req, query, searchField);

    // only selected field

    query =  useSelectField(query,field)

    // pagination

    const total = await model.countDocuments();

    resultPagenation =  usePagination(req, query, false, total);

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

module.exports = queryMiddlware;
