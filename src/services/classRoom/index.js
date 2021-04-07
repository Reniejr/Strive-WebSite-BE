const classRoute = require("express").Router();
const ClassRoomModel = require("./model");
const { auth, adminOnly } = require("../../utilities/auth");
const { updateArray } = require("../../utilities");

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

classRoute.route("/lessons/:batchId").put(async (req, res, next) => {
  try {
    const batch = await ClassRoomModel.findById(req.params.batchId);
    const lessonList = batch.lessons;
    let { module, day } = req.query;
    let lessonI = batch.lessons.findIndex(
      (l, lI) => l.module === module && l.day === day
    );
    lessonList = updateArray(lessonList, { ...req.body }, lessonI);
    batch.lessons = lessonList;
    await batch.save();
    res.send("saved");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
classRoute.route("/lessons/:batchId").post(async (req, res, next) => {
  try {
    const batch = await ClassRoomModel.findById(req.params.batchId);
    const lessonList = batch.lessons;
    lessonList.push(req.body);
    batch.lessons = lessonList;
    await batch.save();
    res.send("saved");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//EXPORT
module.exports = classRoute;
