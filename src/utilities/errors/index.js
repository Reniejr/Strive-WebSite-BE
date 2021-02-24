//NOT FOUND
const notFound = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    let errorMessage;
    err.message ? (errorMessage = err.message) : (errorMessage = "Not Found");
    res.status(404).send(errorMessage);
  }
  next(err);
};
//UNAUTHORIZED
const unAuthorized = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    let errorMessage;
    err.message
      ? (errorMessage = err.message)
      : (errorMessage = "UnAuthorized");
    res.status(401).send(errorMessage);
  }
  next(err);
};
//FORBIDDEN
const forbidden = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    let errorMessage;
    err.message ? (errorMessage = err.message) : (errorMessage = "Forbidden");
    res.status(403).send(errorMessage);
  }
  next(err);
};
//BAD REQUEST
const badRequest = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    let errorMessage;
    err.message ? (errorMessage = err.message) : (errorMessage = "Bad Request");
    res.status(400).send(errorMessage);
  }
  next(err);
};
//GENERIC SERVER ERROR
const genericError = (err, req, res, next) => {
  if (!res.headersSent) {
    let errorMessage;
    err.message
      ? (errorMessage = err.message)
      : (errorMessage = "Generic Server Error");
    res.status(err.httpStatusCode || 500).send(errorMessage);
  }
};

module.exports = {
  notFound,
  unAuthorized,
  forbidden,
  badRequest,
  genericError,
};
