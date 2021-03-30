//NOT FOUND
const notFound = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    let message = {
      status: 404,
      default_message: "NOT FOUND",
      message: err.message ? err.message : null,
    };
    res.status(404).send(message);
  }
  next(err);
};
//UNAUTHORIZED
const unAuthorized = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    let message = {
      status: 401,
      default_message: "UNAUTHORIZED",
      message: err.message ? err.message : null,
    };
    res.status(401).send(message);
  }
  next(err);
};
//FORBIDDEN
const forbidden = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    let message = {
      status: 403,
      default_message: "FORBIDDEN",
      message: err.message ? err.message : null,
    };
    res.status(403).send(message);
  }
  next(err);
};
//BAD REQUEST
const badRequest = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    let message = {
      status: 400,
      default_message: "BAD REQUEST",
      message: err.message ? err.message : null,
    };
    res.status(400).send(message);
  }
  next(err);
};
//GENERIC SERVER ERROR
const genericError = (err, req, res, next) => {
  if (!res.headersSent) {
    let message = {
      status: 500,
      default_message: "GENERIC SERVER ERROR",
      message: err.message ? err.message : null,
    };
    res.status(err.httpStatusCode || 500).send(message);
  }
};

module.exports = {
  notFound,
  unAuthorized,
  forbidden,
  badRequest,
  genericError,
};
