const express = require("express"),
  listEndpoint = require("express-list-endpoints"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  oAuth = require("./utilities/auth/oAuth");

//SEVICES IMPORTS
const mainRoute = require("./services/index");

//ERRORS IMPORTS
const {
  notFound,
  unAuthorized,
  forbidden,
  badRequest,
  genericError,
} = require("./utilities/errors");

//MAIN
const server = express(),
  PORT = process.env.PORT || 5000,
  accessOrigin =
    process.env.NODE_ENV === "production"
      ? [process.env.FE_URL_DEV, process.env.FE_URL_PROD]
      : [process.env.FE_URL_DEV, "http://localhost:3001"],
  corsOptions = {
    origin: function (origin, callback) {
      if (accessOrigin.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(
          new Error("CORS ISSUES : Invalid origin - Check access origins list")
        );
      }
    },
    //WITH COOKIES
    credentials: true,
  };

//MIDDLEWARE
server.use(express.json());
server.use(cors(corsOptions));
server.use(passport.initialize());
//ROUTES
server.get("/", async (req, res, next) => {
  try {
    res.send("<h1>Welcome to Server</h1>");
  } catch (err) {
    console.log(err);
    next(err);
  }
});
server.use("/", mainRoute);

//ERRORS
server.use(notFound);
server.use(unAuthorized);
server.use(forbidden);
server.use(badRequest);
server.use(genericError);

//CONSOLE LOGS
console.log(listEndpoint(server));

//MONGODB CONNECTION
mongoose
  .connect(process.env.MONGODB_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //SERVER LISTEN
  .then(
    server.listen(PORT, () => {
      process.env.NODE_ENV === "production"
        ? console.log(`Server running ONLINE on : ${PORT}`)
        : console.log(`Server running LOCALLY on : http://localhost:${PORT}`);
    })
  )
  .catch((error) => console.log(error));
