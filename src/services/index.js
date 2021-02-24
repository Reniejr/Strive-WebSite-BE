const mainRoute = require("express").Router();

//SERVICES ROUTES IMPORTS
const userRoute = require("./user");
//ENDPOINT
mainRoute.use("/users", userRoute);

//EXPORT
module.exports = mainRoute;
