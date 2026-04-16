import Channel from './channel.model.js';
import workspaceService from '../workspace/workspace.service.js';

class ChannelService {
  async createChannel(workspaceId, userId, data) {
    const workspace = await workspaceService.getWorkspaceById(workspaceId);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    
    const ownerId = workspace.owner?.toString();
    const userIdStr = userId.toString();
    
    let isMember = ownerId === userIdStr;
    
    if (!isMember && workspace.members) {
      for (const m of workspace.members) {
        const memberUserId = typeof m.user === 'object' ? m.user?.toString() : m?.toString();
        if (memberUserId === userIdStr) {
          isMember = true;
          break;
        }
      }
    }
    
    if (!isMember) {
      throw new Error('You must be a member of the workspace to create channels');
    }
    
    const channel = await Channel.create({
      ...data,
      workspace: workspaceId,
      createdBy: userId
    });
    return channel;
  }

  async getChannelsByWorkspace(workspaceId) {
    return Channel.find({ workspace: workspaceId }).sort({ createdAt: 1 });
  }

  async getChannelById(channelId) {
    return Channel.findById(channelId).populate('workspace', 'members owner');
  }

  async updateChannel(channelId, updateData) {
    return Channel.findByIdAndUpdate(channelId, updateData, { new: true });
  }

  async deleteChannel(channelId) {
    return Channel.findByIdAndDelete(channelId);
  }
}

export default new ChannelService();
