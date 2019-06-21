import express from 'express';
import passport from 'passport';
import userController from '../controllers/userController';
import AuthValidation from '../middlewares/authValidation';
import '../config/passport';

const {
  signUp, login, forgotPassword, resetPassword
} = userController;
const {
  validateRegistration,
  validateLogIn,
  validateVerifiedEmail
} = AuthValidation;

const router = express.Router();

// User Routes
router.post('/signup', validateRegistration, signUp);
router.post('/login', validateLogIn, validateVerifiedEmail, login);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

// Social login routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/home')
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/home')
);

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/home')
);

export default router;
