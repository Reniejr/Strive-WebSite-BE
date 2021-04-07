const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const UserModel = require("../../services/user/model");
const { authenticate } = require("./tokenTools");

//GOOGLE
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      const newUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        role: "student",
        refresh_tokens: [],
      };

      try {
        const user = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        } else {
          const createdUser = new UserModel(newUser);
          await createdUser.save();

          const tokens = await authenticate(createdUser);

          done(null, { user: createdUser, tokens });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
//FACEBOOK
passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URL,
      profileFields: [
        "id",
        "displayName",
        "profileUrl",
        "photos",
        "email",
        "name",
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        facebookId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        role: "student",
        refresh_tokens: [],
      };
      try {
        const user = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (user) {
          if (!user.facebookId) {
            user.facebookId = profile.id;
            await user.save();
          }
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        } else {
          const createdUser = new UserModel(newUser);
          await createdUser.save();

          const tokens = await authenticate(createdUser);
          done(null, { user, tokens });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
//GITHUB
passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(profile);

      try {
        const user = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            user.githubUsername = profile.username;
            await user.save();
          }
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        } else {
          done(error);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
//LINKEDIN
passport.use(
  "linkedin",
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT_URL,
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(profile);
      // process.nextTick(function () {
      //   console.log("line 151", profile);

      //   return done(null, profile);
      // });
      try {
        const user = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (user) {
          if (!user.linkedInId) {
            user.linkedInId = profile.id;
            await user.save();
          }
          user.studentInfo.linkedInStatus = {
            ...user.studentInfo.linkedInStatus,
            linkedInPic: profile.photos[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
          };
          user.markModified("studentInfo");
          await user.save();
          // const tokens = await authenticate(user);
          const tokens = {
            access_token: accessToken,
          };
          console.log(user);
          // console.log("riga 170", tokens);
          done(null, { user, tokens });
        } else {
          done(error);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
