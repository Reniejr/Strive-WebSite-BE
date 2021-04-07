const { Schema, model } = require("mongoose");

const ClassRoomModel = new Schema(
  {
    course: { type: String, enum: ["Web", "AI"] },
    name: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    status: { type: String, enum: ["not started", "on going", "ended"] },
    studentList: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teacherList: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lessons: [
      {
        module: { type: String },
        day: { type: String },
        topic: { type: String },
        liveLink: { type: String },
        recordedLink: { type: String },
        codeLink: { type: String },
        homework: { type: String },
        hwLink: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("ClassRoom", ClassRoomModel);
