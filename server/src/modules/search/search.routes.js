import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import workspaceService from '../workspace/workspace.service.js';
import messageService from '../message/message.service.js';
import taskService from '../task/task.service.js';
import documentService from '../document/document.service.js';
import userService from '../user/user.service.js';

const router = express.Router();

router.get('/global', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { q, workspaceId } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ users: [], messages: [], tasks: [], documents: [] });
    }

    const results = {
      users: [],
      messages: [],
      tasks: [],
      documents: []
    };

    results.users = await userService.searchUsers(q);
    
    if (workspaceId) {
      results.messages = await messageService.searchMessages(q, workspaceId);
      results.tasks = await taskService.searchTasks(q, workspaceId);
      results.documents = await documentService.searchDocuments(q, workspaceId);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
