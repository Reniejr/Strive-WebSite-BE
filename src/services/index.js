const mainRoute = require("express").Router();

//SERVICES ROUTES IMPORTS
const userRoute = require("./user");
const classRoute = require("./classRoom");
const fileRouter = require("./uploadFile");
//ENDPOINT
mainRoute.use("/users", userRoute);
mainRoute.use("/batch", classRoute);
mainRoute.use("/file-upload", fileRouter);

//EXPORT
module.exports = mainRoute;
