const userRoute = require("express").Router(),
  passport = require("passport"),
  generator = require("generate-password"),
  sgMail = require("@sendgrid/mail"),
  { eMail, welcomeMsg } = require("../../utilities/email"),
  UserModel = require("./model"),
  { auth, adminOnly, socialAuthRedirect } = require("../../utilities/auth"),
  { authenticate, refreshTokens } = require("../../utilities/auth/tokenTools"),
  { userUpload } = require("../../utilities/cloudinary");
const ClassRoomModel = require("../classRoom/model");
const mongoose = require("mongoose");

//ENDPOINTS
//POST
userRoute.route("/new-user/:batchId").post(async (req, res, next) => {
  try {
    const newPwd = generator.generate({ length: 10, numbers: true });
    const newUser = await UserModel({ ...req.body, password: newPwd }),
      { _id } = await newUser.save();

    //UPDATE CLASSROOM
    let editClass = await ClassRoomModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.batchId) },
      { $addToSet: { studentList: { _id } } }
    );

    //SEND EMAIL
    sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
    const emailContent = eMail(
      req.body.email,
      "developer.reniejr@gmail.com",
      `Welcome to Strive School`,
      newPwd
    );

    // console.log(emailContent);
    await sgMail.send(emailContent);

    res.send(newUser);
  } catch (err) {
    next(err);
  }
});
//POST
userRoute.route("/admin-register").post(async (req, res, next) => {
  try {
    const newUser = await UserModel({ ...req.body, studentInfo: undefined }),
      { _id } = await newUser.save();

    res.send(newUser);
  } catch (err) {
    next(err);
  }
});

//GET TOKENS
userRoute.route("/authorize").post(async (req, res, next) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    const tokens = await authenticate(user);
    res.send(tokens);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
//GET FIRST TOKENS
userRoute.route("/first-authorize").post(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email);
    const user = await UserModel.findByEmail(email, password);
    const tokens = await authenticate(user);
    res.send(tokens);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//GET
userRoute.route("/").get(auth, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

//GET BY USER
userRoute.route("/profile").get(auth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    next(err);
  }
});

//GET USER BY ADMIN
userRoute
  .route("/profile/:userId")
  .get(auth, adminOnly, async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      res.send(user);
    } catch (err) {
      next(err);
    }
  });

//EDIT BY USER
userRoute.route("/profile").put(auth, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    console.log(req.body);
    res.send(req.user);
    res.send(updates);
  } catch (err) {
    next(err);
  }
});

//EDIT BY ADMIN
userRoute
  .route("/admin/:userId")
  .put(auth, adminOnly, async (req, res, next) => {
    try {
      const userId = req.params.userId;
      let body = req.body;
      const editUser = await UserModel.findByIdAndUpdate(userId, body, {
        runValidators: true,
        new: true,
      });
      await editUser.save();
      res.send(editUser);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

//DELETE BY USER
userRoute.route("/profile").delete(auth, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.send("User Deleted");
  } catch (err) {
    next(err);
  }
});

//POST IMAGE
userRoute
  .route("/profile-pic")
  .post(auth, userUpload.single("user"), async (req, res, next) => {
    try {
      // console.log(req.file);
      req.user.profile = req.file.path;
      await req.user.save();
      res.send(`PROFILE PIC :${req.file.originalname} has been uploaded `);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

//DELETE BY ADMIN
userRoute
  .route("/profile/:userId")
  .delete(auth, adminOnly, async (req, res, next) => {
    try {
      const deletedUser = await UserModel.findByIdAndRemove(req.params.userId);
      res.send(
        `User with ID : ${req.params.userId} has been succesfully deleted`
      );
    } catch (err) {
      next(err);
    }
  });

//GET NEW TOKENS
userRoute.route("/authorize/refresh_tokens", async (req, res, next) => {
  const oldRefreshToken = req.body.refresh_token;
  if (!oldRefreshToken) {
    const err = new Error("Invalid Refresh Token - Missing or Expired");
    err.httpStatusCode = 400;
    next(err);
  } else {
    try {
      const newTokens = await refreshTokens(oldRefreshToken);
      res.send(newTokens);
    } catch (err) {
      console.log(err);
      const error = new Error("FORBIDDEN - Something went wrong");
      error.httpStatusCode = 403;
      next(error);
    }
  }
});

//LOGOUT DEVICE
userRoute.route("/logout").post(auth, async (req, res, next) => {
  try {
    req.user.refresh_token = req.user.refresh_token.filter(
      (token) => token.token !== req.body.refresh_token
    );
    await req.user.save();
    res.send(
      `Logged Out - Refresh Token : ${req.body.refresh_token} has been removed`
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//LOGOUT ALL DEVICES
userRoute.route("/logoutAll").post(auth, async (req, res, next) => {
  try {
    console.log(req.user);
    req.user.refresh_tokens = [];
    await req.user.save();
    res.send(`User logout`);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//GOOGLE
userRoute.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//GOOGLE REDIRECT
userRoute.get(
  "/googleRedirect",
  passport.authenticate("google"),
  socialAuthRedirect
);

//FACEBOOK LOGIN
userRoute.get(
  "/facebookLogin",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

//FACEBOOK REDIRECT
userRoute.get(
  "/facebookRedirect",
  passport.authenticate("facebook"),
  socialAuthRedirect
);

//GITHUB LOGIN
userRoute.get(
  "/gitHubLogin",
  passport.authenticate("github", { scope: ["user", "email"] })
);

//GITHUB REDIRECT
userRoute.get(
  "/gitHubRedirect",
  passport.authenticate("github"),
  async (req, res, next) => {
    try {
      // res.cookie("validate", true, { httpOnly: false });
      // res.cookie("github", true, { httpOnly: false });
      // console.log(req.user);
      res.redirect(
        `${process.env.FE_URL_DEV}/sign-in/${req.user.user._id}?validate=true&github=true`
      );
    } catch (error) {
      res.redirect(
        `${process.env.FE_URL_DEV}/sign-in/${req.user.user._id}?validate=true&github=false`
      );
      console.log(error);
      next(error);
    }
  }
);

//LINKEDIN LOGIN
userRoute.get(
  "/linkedInLogin",
  // passport.authenticate("linkedin", {
  //   scope: ["r_emailaddress", "r_liteprofile"],
  // })
  passport.authenticate("linkedin", {
    state: ["SOME STATE"],
  }),
  function (req, res) {}
);

//LINKEDIN REDIRECT
userRoute.get(
  "/linkedInRedirect",
  passport.authenticate("linkedin"),
  async (req, res, next) => {
    try {
      // res.cookie("validate", true, { httpOnly: false });
      // res.cookie("linkedin", true, { httpOnly: false });
      // res.cookie("access_token", req.user.tokens.access_token, {
      //   httpOnly: true,
      // });

      res.redirect(
        `${process.env.FE_URL_DEV}/sign-in/${req.user.user._id}?access_token=${req.user.tokens.access_token}&validate=true&linkedin=true`
      );
    } catch (error) {
      res.redirect(
        `${process.env.FE_URL_DEV}/sign-in/${req.user.user._id}?validate=true&linkedin=false`
      );
      console.log(error);
      next(error);
    }
  }
);

module.exports = userRoute;
