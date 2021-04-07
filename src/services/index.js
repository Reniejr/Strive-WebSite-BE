const mainRoute = require("express").Router();

//SERVICES ROUTES IMPORTS
const userRoute = require("./user");
const classRoute = require("./classRoom");
const fileRouter = require("./uploadFile");
const testRoute = require("./getTest");
//ENDPOINT
mainRoute.use("/users", userRoute);
mainRoute.use("/batch", classRoute);
mainRoute.use("/file-upload", fileRouter);
mainRoute.use("/get-test", testRoute);

//EXPORT
module.exports = mainRoute;
