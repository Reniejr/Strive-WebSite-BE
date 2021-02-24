const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const UserModel = require("../../services/user/model");
const { authenticate } = require("./tokenTools");

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
        username: profile.displayName,
        email: profile.emails[0].value,
        role: "user",
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
        username: profile.displayName,
        email: profile.emails[0].value,
        role: "user",
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

passport.serializeUser(function (user, done) {
  done(null, user);
});
