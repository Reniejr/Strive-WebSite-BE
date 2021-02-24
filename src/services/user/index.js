const userRoute = require("express").Router(),
  UserModel = require("./model"),
  { auth, adminOnly, socialAuthRedirect } = require("../../utilities/auth"),
  { authenticate, refreshTokens } = require("../../utilities/auth/tokenTools"),
  passport = require("passport");

//ENDPOINTS
userRoute.route("/").post(async (req, res, next) => {
  try {
    const newUser = await UserModel(req.body),
      { _id } = await newUser.save();
    res.send(newUser);
  } catch (err) {
    next(err);
  }
});

//GET TOKENS
userRoute.route("/authorize").post(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findByCredentials(username, password);
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
    req.user.refresh_token = [];
    await req.user.save();
    // res.send(`User logout`);
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

module.exports = userRoute;
