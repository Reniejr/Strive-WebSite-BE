const UserModel = require("../../services/user/model");
const { validateJWT } = require("./tokenTools");

const auth = async (req, res, next) => {
  try {
    //WITH COOKIES
    // const token = req.cookies.access_token
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await validateJWT(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    const user = await UserModel.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error("NOT FOUND");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    const err = new Error("Please Authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const adminOnly = async (req, res, next) => {
  if (req.body.user && req.body.user.role === "admin") {
    next();
  } else {
    const err = new Error();
    err.httpStatusCode = 403;
    err.message = "FORBIDDEN - ADMIN ONLY";
    next(err);
  }
};

const socialAuthRedirect = async (req, res, next) => {
  try {
    //WITH COOKIES
    // res.cookie("accessToken", req.user.tokens.access_token, {
    //   httpOnly: true,
    // });
    // res.cookie("refreshToken", req.user.tokens.refresh_token, {
    //   httpOnly: true,
    //   path: "/users/refreshToken",
    // });
    // res.redirect(`${process.env.FE_URL_DEV}/home`);
    // console.log(req.user);
    console.log(req.user.tokens);
    // res.redirect(
    //   `${process.env.FE_URL_DEV}/sign-in/${req.user._id}/?access_token=${req.user.tokens.access_token}`
    // );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  auth,
  adminOnly,
  socialAuthRedirect,
};
