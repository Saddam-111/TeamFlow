import express from 'express';
import taskController from './task.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware.verifyToken, taskController.create);
router.get('/', authMiddleware.verifyToken, taskController.getAll);
router.get('/:id', authMiddleware.verifyToken, taskController.getById);
router.put('/:id', authMiddleware.verifyToken, taskController.update);
router.delete('/:id', authMiddleware.verifyToken, taskController.delete);
router.post('/reorder', authMiddleware.verifyToken, taskController.reorder);

export default router;
