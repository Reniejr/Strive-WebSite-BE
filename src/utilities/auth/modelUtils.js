const bcrypt = require("bcryptjs");

const findMethod = (userModel) => {
  return (userModel.statics.findByCredentials = async function (
    username,
    password
  ) {
    const user = await this.findOne({ username });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
};

const jsonMethod = (userModel, properties) => {
  return (userModel.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    properties.forEach((property) => delete userObj[property]);
    // delete userObj.password;
    // delete userObj.__v;

    return userObj;
  });
};

const preSave = (userModel) => {
  return userModel.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    next();
  });
};

module.exports = { findMethod, jsonMethod, preSave };
