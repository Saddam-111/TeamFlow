import express from 'express';
import documentController from './document.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware.verifyToken, documentController.create);
router.get('/', authMiddleware.verifyToken, documentController.getAll);
router.get('/:id', authMiddleware.verifyToken, documentController.getById);
router.put('/:id', authMiddleware.verifyToken, documentController.update);
router.delete('/:id', authMiddleware.verifyToken, documentController.delete);
router.post('/:id/collaborators', authMiddleware.verifyToken, documentController.addCollaborator);
router.delete('/:id/collaborators/:userId', authMiddleware.verifyToken, documentController.removeCollaborator);

export default router;
