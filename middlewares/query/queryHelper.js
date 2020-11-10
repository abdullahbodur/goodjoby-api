

const usePopulation = (query, population) => {
  return query.populate(population);
};

const searchControl = (req, query, controlSpace) => {
  if (req.query.search) {
    const queryObj = {};
    const regex = new RegExp(req.query.search, "i");

    queryObj[controlSpace] = regex;
    return query.where(queryObj); 
  }

  return query;
};

const useSorting = (req, query, sortingField) => {
  const sortKey = req.query.sortkey;
  console.log(sortKey);
  if (sortKey) return query.sort(`-${sortingField}`);

  return query;
};

const usePagination = async (req, query, isIndexing, total) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const lastOne = page * limit;

  if (isIndexing) {
    const pagenation = {};
    if (startIndex > 0) {
      pagenation.previous = {
        previous_page: page - 1,
      };
    }

    if (total > lastOne) {
      pagenation.next = {
        next_page: page + 1,
        last_page: Math.ceil(total / limit),
      };
    }
  }

  return {
    query: query.skip(startIndex).limit(limit),
    pagenation: isIndexing ? pagenation : undefined,
    startIndex: startIndex,
    lastOne: lastOne,
  };
};

const useSelectField = (query, field) => {

  if(field)return query.select(field)

  return query;
};



module.exports = {
  usePagination,
  usePopulation,
  searchControl,
  useSorting,
  useSelectField
};
