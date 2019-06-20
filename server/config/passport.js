import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import dotenv from 'dotenv';
import Users from '../models/users';
import generateToken from '../helpers/encrypt';

dotenv.config();

const {
  SERVER_URL,
  GOOGLE_ID,
  GOOGLE_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
} = process.env;

const { findUserInput } = Users;

const google = passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        try {
          const user = await findUserInput({ googleId: profile.id });
          const userObject = user;
          const token = generateToken(profile.id);
          userObject.token = token;
          return cb(null, userObject);
        } catch (error) {
          return cb(error, false);
        }
      });
    }
  )
);

const facebook = passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
      callbackURL: `${SERVER_URL}/auth/facebook/callback`
    },
    (accessToken, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        try {
          const user = await findUserInput({ facebookId: profile.id });
          const userObject = user;
          const token = generateToken(profile.id);
          userObject.token = token;
          return cb(null, userObject);
        } catch (error) {
          return cb(error, false);
        }
      });
    }
  )
);

const twitter = passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: `${SERVER_URL}/auth/twitter/callback`
    },
    (accessToken, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        try {
          const user = await findUserInput({ twitterId: profile.id });
          const userObject = user;
          const token = generateToken(profile.id);
          userObject.token = token;
          return cb(null, userObject);
        } catch (error) {
          return cb(error, false);
        }
      });
    }
  )
);

passport.serializeUser((user, cb) => cb(null, user.id));

passport.deserializeUser((id, cb) => {
  findUserInput({ id }, (err, user) => cb(err, user));
});

export { google, facebook, twitter };
