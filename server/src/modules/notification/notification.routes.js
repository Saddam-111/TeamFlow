import express from 'express';
import notificationController from './notification.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware.verifyToken, notificationController.getAll);
router.get('/unread-count', authMiddleware.verifyToken, notificationController.getUnreadCount);
router.put('/:id/read', authMiddleware.verifyToken, notificationController.markAsRead);
router.put('/read-all', authMiddleware.verifyToken, notificationController.markAllAsRead);
router.delete('/:id', authMiddleware.verifyToken, notificationController.delete);

export default router;
