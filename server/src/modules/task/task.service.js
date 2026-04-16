import Task from './task.model.js';

class TaskService {
  async createTask(data) {
    const lastTask = await Task.findOne({ workspace: data.workspace, status: data.status || 'todo' })
      .sort({ order: -1 });
    
    const order = lastTask ? lastTask.order + 1 : 0;
    
    const task = await Task.create({
      ...data,
      order
    });
    return this.getTaskById(task._id);
  }

  async getTaskById(id) {
    return Task.findById(id)
      .populate('assignee', 'username avatar email')
      .populate('reporter', 'username avatar email');
  }

  async getTasksByWorkspace(workspaceId) {
    return Task.find({ workspace: workspaceId })
      .populate('assignee', 'username avatar email')
      .populate('reporter', 'username avatar email')
      .sort({ status: 1, order: 1 });
  }

  async getTasksByStatus(workspaceId, status) {
    return Task.find({ workspace: workspaceId, status })
      .populate('assignee', 'username avatar email')
      .populate('reporter', 'username avatar email')
      .sort({ order: 1 });
  }

async updateTask(taskId, userId, updateData, workspaceOwnerId = null) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Allow if user is reporter, assignee, or workspace owner/admin
    const isReporter = task.reporter.toString() === userId;
    const isAssignee = task.assignee?.toString() === userId;
    const isWorkspaceOwner = workspaceOwnerId && task.workspace.toString() === workspaceOwnerId;

    if (!isReporter && !isAssignee && !isWorkspaceOwner) {
      // Check if user is admin in workspace members
      const Workspace = (await import('../workspace/workspace.model.js')).default;
      const workspace = await Workspace.findById(task.workspace);
      const member = workspace?.members.find(m => m.user.toString() === userId && m.role === 'admin');
      const isAdmin = !!member;

      if (!isAdmin) {
        throw new Error('Not authorized to update this task');
      }
    }

    if (task.reporter.toString() !== userId.toString() && task.assignee?.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this task');
    }

    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignee', 'tags'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        filteredUpdates[key] = updateData[key];
      }
    }

    if (updateData.status) {
      const lastTask = await Task.findOne({ workspace: task.workspace, status: updateData.status })
        .sort({ order: -1 });
      filteredUpdates.order = lastTask ? lastTask.order + 1 : 0;
    }

    return Task.findByIdAndUpdate(taskId, filteredUpdates, { new: true })
      .populate('assignee', 'username avatar email')
      .populate('reporter', 'username avatar email');
  }

  async deleteTask(taskId, userId, workspaceId = null) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Allow if user is reporter or workspace owner
    if (task.reporter.toString() !== userId) {
      // Check if user is workspace owner
      if (workspaceId) {
        const Workspace = (await import('../workspace/workspace.model.js')).default;
        const workspace = await Workspace.findById(workspaceId);
        if (workspace?.owner.toString() === userId) {
          return Task.findByIdAndDelete(taskId);
        }
      }
      throw new Error('Not authorized to delete this task');
    }

    return Task.findByIdAndDelete(taskId);
  }

  async reorderTasks(workspaceId, status, orderedIds) {
    const updates = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, workspace: workspaceId, status },
        update: { order: index }
      }
    }));
    
    return Task.bulkWrite(updates);
  }

  async searchTasks(query, workspaceId) {
    return Task.find({
      workspace: workspaceId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('assignee', 'username avatar email').limit(50);
  }
}

export default new TaskService();
