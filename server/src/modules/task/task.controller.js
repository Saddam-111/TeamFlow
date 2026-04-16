import taskService from './task.service.js';
import notificationService from '../notification/notification.service.js';
import socketService from '../../services/socket.service.js';

class TaskController {
  async create(req, res) {
    try {
      const task = await taskService.createTask({
        ...req.body,
        workspace: req.params.workspaceId,
        reporter: req.user.id
      });

      if (task.assignee && task.assignee._id.toString() !== req.user.id) {
        await notificationService.createNotificationAndEmit(socketService.io, {
          recipient: task.assignee._id,
          sender: req.user.id,
          type: 'task_assigned',
          title: 'New Task Assigned',
          content: `${req.user.username || 'Someone'} assigned you to "${task.title}"`,
          link: `/workspace/${req.params.workspaceId}/tasks`
        });
      }

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const { status } = req.query;
      const tasks = status 
        ? await taskService.getTasksByStatus(req.params.workspaceId, status)
        : await taskService.getTasksByWorkspace(req.params.workspaceId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const existingTask = await taskService.getTaskById(req.params.id);
      const task = await taskService.updateTask(req.params.id, req.user.id, req.body, req.user.workspaceOwnerId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (task.assignee && existingTask.assignee) {
        if (task.assignee._id.toString() !== existingTask.assignee._id.toString() && task.assignee._id.toString() !== req.user.id) {
          await notificationService.createNotificationAndEmit(socketService.io, {
            recipient: task.assignee._id,
            sender: req.user.id,
            type: 'task_assigned',
            title: 'Task Assigned',
            content: `${req.user.username || 'Someone'} assigned you to "${task.title}"`,
            link: `/workspace/${req.params.workspaceId}/tasks`
          });
        }
      } else if (task.assignee && task.assignee._id.toString() !== req.user.id) {
        await notificationService.createNotificationAndEmit(socketService.io, {
          recipient: task.assignee._id,
          sender: req.user.id,
          type: 'task_assigned',
          title: 'Task Assigned',
          content: `${req.user.username || 'Someone'} assigned you to "${task.title}"`,
          link: `/workspace/${req.params.workspaceId}/tasks`
        });
      }

      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await taskService.deleteTask(req.params.id, req.user.id, req.body.workspaceId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async reorder(req, res) {
    try {
      const { status, orderedIds } = req.body;
      await taskService.reorderTasks(req.params.workspaceId, status, orderedIds);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TaskController();
