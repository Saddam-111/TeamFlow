import Workspace from './workspace.model.js';
import { v4 as uuidv4 } from 'uuid';

class WorkspaceService {
  async createWorkspace(ownerId, data) {
    const workspace = await Workspace.create({
      ...data,
      owner: ownerId,
      members: [{ user: ownerId, role: 'admin' }],
      inviteCode: uuidv4()
    });
    return workspace;
  }

  async getWorkspaceById(id) {
    const workspace = await Workspace.findById(id).populate('members.user', 'username email avatar isOnline');
    
    if (workspace) {
      const Channel = (await import('../channel/channel.model.js')).default;
      const channels = await Channel.find({ workspace: id });
      workspace._doc.channels = channels;
    }
    
    return workspace;
  }

  async getWorkspaceBySlug(slug) {
    return Workspace.findOne({ slug }).populate('members.user', 'username email avatar isOnline');
  }

  async getUserWorkspaces(userId) {
    return Workspace.find({
      'members.user': userId
    }).populate('members.user', 'username email avatar');
  }

  async updateWorkspace(workspaceId, userId, updateData) {
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (workspace.owner.toString() !== userId.toString()) {
      throw new Error('Only owner can update workspace');
    }

    const allowedUpdates = ['name', 'description'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        filteredUpdates[key] = updateData[key];
      }
    }

    return Workspace.findByIdAndUpdate(workspaceId, filteredUpdates, { new: true });
  }

  async addMember(workspaceId, userId, inviteCode) {
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (workspace.inviteCode !== inviteCode) {
      throw new Error('Invalid invite code');
    }

    await workspace.addMember(userId);
    return workspace;
  }

  async removeMember(workspaceId, ownerId, memberId) {
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (workspace.owner.toString() !== ownerId.toString()) {
      throw new Error('Only owner can remove members');
    }

    if (memberId === ownerId) {
      throw new Error('Cannot remove yourself');
    }

    await workspace.removeMember(memberId);
    return workspace;
  }

  async regenerateInviteCode(workspaceId, ownerId) {
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (workspace.owner.toString() !== ownerId.toString()) {
      throw new Error('Only owner can regenerate invite code');
    }

    workspace.inviteCode = uuidv4();
    return workspace.save();
  }

  async searchWorkspaces(query) {
    return Workspace.find({
      name: { $regex: query, $options: 'i' }
    }).limit(20);
  }
}

export default new WorkspaceService();
