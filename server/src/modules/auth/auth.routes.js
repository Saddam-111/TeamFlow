import express from 'express';
import authController from './auth.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authMiddleware.verifyToken, authController.me);
router.post('/logout', authMiddleware.verifyToken, authController.logout);

export default router;
