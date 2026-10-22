exports.notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
};

exports.errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (err.name === 'CastError' || err.name === 'ValidationError') status = 400;
  res.status(status).json({ message: err.message });
};