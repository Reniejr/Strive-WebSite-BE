const mainRoute = require("express").Router();

//SERVICES ROUTES IMPORTS
const userRoute = require("./user");
const classRoute = require("./classRoom");
//ENDPOINT
mainRoute.use("/users", userRoute);
mainRoute.use("/batch", classRoute);

//EXPORT
module.exports = mainRoute;
