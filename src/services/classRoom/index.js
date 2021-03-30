const classRoute = require("express").Router();
const ClassRoomModel = require("./model");
const { auth, adminOnly } = require("../../utilities/auth");

//METHODS

//POST
classRoute.route("/").post(adminOnly, async (req, res, next) => {
  try {
    let body = req.body.classRoom;
    const newClassRoom = await new ClassRoomModel(body),
      { _id } = await newClassRoom.save();
    res.send(newClassRoom);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET
classRoute.route("/").get(async (req, res, next) => {
  try {
    const classRoomList = await ClassRoomModel.find();
    res.send(classRoomList);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET BY ID
classRoute.route("/:batchId").get(async (req, res, next) => {
  try {
    const classRoom = await await ClassRoomModel.findById(req.params.batchId)
      .populate("studentList")
      .populate("teacherList");
    res.send(classRoom);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//EXPORT
module.exports = classRoute;
