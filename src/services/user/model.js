const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  {
    findMethod,
    jsonMethod,
    preSave,
    onlyEmailFind,
  } = require("../../utilities/auth/modelUtils");

const UserModel = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    email: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "student"],
    },
    profile: { type: String },
    occupation: { type: String },
    refresh_tokens: [{ token: { type: String } }],
    googleId: { type: String },
    // facebookId: { type: String },
    githubId: { type: String },
    githubUsername: { type: String },
    linkedInId: { type: String },
    studentInfo: {
      course: { type: String },
      batch: { type: String },
      section: { type: String },
      attendance: [
        {
          module: { type: String },
          day: { type: String },
          date: { type: String },
          present: { type: Boolean },
          topics: { type: String },
        },
      ],
      homeworks: [
        {
          module: { type: String },
          day: { type: String },
          task: Schema.Types.Mixed,
          githubRepo: { type: String },
          completed: { type: Boolean },
        },
      ],
      linkedInStatus: {
        connections: [{ type: Number }],
        linkedInPic: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        birthDate: { type: String },
      },
      exams: [Schema.Types.Mixed],
    },
  },
  { timestamps: true }
);

onlyEmailFind(UserModel);
findMethod(UserModel);
jsonMethod(UserModel, ["password", "__v"]);
preSave(UserModel);

module.exports = mongoose.model("User", UserModel);
