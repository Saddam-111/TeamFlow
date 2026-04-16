import workspaceService from './workspace.service.js';

class WorkspaceController {
  async create(req, res) {
    try {
      const { name, description } = req.body;
      const workspace = await workspaceService.createWorkspace(req.user.id, { name, description });
      res.status(201).json(workspace);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const workspaces = await workspaceService.getUserWorkspaces(req.user.id);
      res.json(workspaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const workspace = await workspaceService.getWorkspaceById(req.params.id);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }
      res.json(workspace);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const workspace = await workspaceService.updateWorkspace(req.params.id, req.user.id, req.body);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }
      res.json(workspace);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async join(req, res) {
    try {
      const { inviteCode } = req.body;
      const workspace = await workspaceService.addMember(req.params.id, req.user.id, inviteCode);
      res.json(workspace);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async leave(req, res) {
    try {
      const workspace = await workspaceService.removeMember(req.params.id, req.user.id, req.user.id);
      res.json(workspace);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeMember(req, res) {
    try {
      const workspace = await workspaceService.removeMember(req.params.id, req.user.id, req.params.memberId);
      res.json(workspace);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async regenerateCode(req, res) {
    try {
      const workspace = await workspaceService.regenerateInviteCode(req.params.id, req.user.id);
      res.json({ inviteCode: workspace.inviteCode });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new WorkspaceController();
