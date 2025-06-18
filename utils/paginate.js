// utils/paginate.js

const paginate = (query, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    query: query.skip(skip).limit(limit),
    page,
    limit,
    skip,
  };
};

export default paginate;
