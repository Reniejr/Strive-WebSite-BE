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
    course: { type: String, enum: ["Web", "AI"] },
    profile: { type: String },
    occupation: { type: String },
    refresh_tokens: [{ token: { type: String } }],
    googleId: { type: String },
    // facebookId: { type: String },
    githubId: { type: String },
    githubUsername: { type: String },
    linkedInId: { type: String },
    studentInfo: {
      type: {
        course: { type: String },
        batch: { type: String },
        section: { type: String },
        attendance: [
          {
            module: { type: String },
            day: { type: String },
            present: { type: Boolean },
            topic: { type: String },
            liveLink: { type: String },
            recordedLink: { type: String },
            codeLink: { type: String },
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
          refresh_tokens: [{ type: String }],
        },
        exams: [Schema.Types.Mixed],
      },
      required: isStudent,
    },
  },
  { timestamps: true }
);

function isStudent() {
  if (this.role === "student") {
    return true;
  }
  return false;
}

onlyEmailFind(UserModel);
findMethod(UserModel);
jsonMethod(UserModel, ["password", "__v"]);
preSave(UserModel);

// UserModel.set("studentInfo", undefined, { strict: false });

module.exports = mongoose.model("User", UserModel);
