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
  },
  { timestamps: true }
);

module.exports = model("ClassRoom", ClassRoomModel);
