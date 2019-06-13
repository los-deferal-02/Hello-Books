import express from 'express';
import userController from '../controllers/userController';
import Auth from '../middlewares/auth';

const { editUserProfile, viewUserProfile } = userController;
const { verifyToken } = Auth;

const router = express.Router();

router.patch('/:id', verifyToken, editUserProfile);
router.get('/:id', viewUserProfile);

export default router;
