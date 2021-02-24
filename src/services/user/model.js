const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  {
    findMethod,
    jsonMethod,
    preSave,
  } = require("../../utilities/auth/modelUtils");

const UserModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
    profile: { type: String },
    refresh_tokens: [{ token: { type: String } }],
    googleId: { type: String },
    facebookId: { type: String },
  },
  { timestamps: true }
);

findMethod(UserModel);
jsonMethod(UserModel, ["password", "__v"]);
preSave(UserModel);

module.exports = mongoose.model("User", UserModel);
