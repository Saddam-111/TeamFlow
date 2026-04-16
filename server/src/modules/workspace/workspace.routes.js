import express from 'express';
import workspaceController from './workspace.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware.verifyToken, workspaceController.create);
router.get('/', authMiddleware.verifyToken, workspaceController.getAll);
router.get('/:id', authMiddleware.verifyToken, workspaceController.getById);
router.put('/:id', authMiddleware.verifyToken, workspaceController.update);
router.post('/:id/join', authMiddleware.verifyToken, workspaceController.join);
router.post('/:id/leave', authMiddleware.verifyToken, workspaceController.leave);
router.delete('/:id/members/:memberId', authMiddleware.verifyToken, workspaceController.removeMember);
router.post('/:id/regenerate-code', authMiddleware.verifyToken, workspaceController.regenerateCode);

export default router;
