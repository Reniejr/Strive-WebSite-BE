const fileRouter = require("express").Router();
const mongoose = require("mongoose");
const UserModel = require("../user/model");
const ClassRoomModel = require("../classRoom/model");
const { updateArray, readFile, fileUpload } = require("../../utilities");
const { auth } = require("../../utilities/auth");

fileRouter.post(
  "/:batchId",
  fileUpload.single("file"),
  async (req, res, next) => {
    try {
      // console.log(req.file.path);
      const { module, day } = req.query;
      const content = await readFile(req.file.path);
      let batch = await ClassRoomModel.findById(
        req.params.batchId,
        async function (err, batch) {
          //LESSON HW
          let lessonI = batch.lessons.findIndex(
            (l) => l.module === module && l.day === day
          );
          let lesson = await batch.lessons.filter(
            (l) => l.module === module && l.day === day
          )[0];
          let body = {
            _id: lesson._id,
            module: lesson.module,
            day: lesson.day,
            topic: lesson.topic,
            liveLink: lesson.liveLink,
            recordedLink: lesson.recordedLink,
            codeLink: lesson.codeLink,
            homework: content.content,
            hwLink: lesson.hwLink,
          };
          batch.lessons = updateArray(batch.lessons, body, lessonI);
          batch.markModified("lessons");
          batch.save();
        }
      );

      // console.log(updateBatch);

      //STUDENTS HW
      let students = await UserModel.find({
        role: "student",
      });
      students = await students.filter(
        (stud) => stud.studentInfo.batch === batch.name
      );

      students.map(async (student) => {
        const hw = {
          module: module,
          day: day,
          completed: false,
          task: content,
        };
        const putHw = await UserModel.findById(
          student._id,
          async function (err, user) {
            let hwList = user.studentInfo.homeworks;
            let findHw = hwList.findIndex((homeW) =>
              homeW.module === hw.module && homeW.day === hw.day ? homeW : null
            );
            user.studentInfo.homeworks = updateArray(hwList, hw, findHw);
            user.markModified("studentInfo");
            await user.save();
          }
        );
      });
      // console.log(students);
      res.send(content);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

fileRouter.route("/profile/:hwId").put(auth, async (req, res) => {
  try {
    let hwList = req.user.studentInfo.homeworks;
    let hw = hwList.filter(
      (homeW) => homeW._id.toString() === req.params.hwId
    )[0];
    let index = hwList.findIndex(
      (homeW) => homeW._id.toString() === req.params.hwId
    );
    hw.completed = req.body.completed;
    req.body.githubRepo
      ? (hw.githubRepo = req.body.githubRepo)
      : (hw.githubRepo = "");
    console.log(hw);
    req.user.studentInfo.homeworks = updateArray(hwList, hw, index);
    req.user.save();
    res.send(hw);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = fileRouter;
