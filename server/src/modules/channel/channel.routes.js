import express from 'express';
import channelController from './channel.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware.verifyToken, channelController.create);
router.get('/', authMiddleware.verifyToken, channelController.getAll);
router.get('/:id', authMiddleware.verifyToken, channelController.getById);
router.put('/:id', authMiddleware.verifyToken, channelController.update);
router.delete('/:id', authMiddleware.verifyToken, channelController.delete);
router.get('/:id/messages', authMiddleware.verifyToken, channelController.getMessages);
router.post('/:id/messages', authMiddleware.verifyToken, channelController.createMessage);
router.put('/:id/messages/:messageId', authMiddleware.verifyToken, channelController.updateMessage);
router.delete('/:id/messages/:messageId', authMiddleware.verifyToken, channelController.deleteMessage);

export default router;