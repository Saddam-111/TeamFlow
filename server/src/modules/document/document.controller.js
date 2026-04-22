import documentService from './document.service.js';
import workspaceService from '../workspace/workspace.service.js';

class DocumentController {
  async create(req, res) {
    try {
      const document = await documentService.createDocument({
        ...req.body,
        workspace: req.params.workspaceId,
        owner: req.user.id
      });
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const documents = await documentService.getDocumentsByWorkspace(req.params.workspaceId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const document = await documentService.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      let workspaceMembers = [];
      try {
        const workspace = await workspaceService.getWorkspaceById(req.params.workspaceId);
        workspaceMembers = workspace?.members || [];
      } catch (e) {
        console.error('Failed to get workspace members:', e);
      }
      
      const document = await documentService.updateDocument(req.params.id, req.user.id, req.body, workspaceMembers);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await documentService.deleteDocument(req.params.id, req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addCollaborator(req, res) {
    try {
      const { userId, permission } = req.body;
      const document = await documentService.addCollaborator(req.params.id, req.user.id, userId, permission);
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeCollaborator(req, res) {
    try {
      const document = await documentService.removeCollaborator(req.params.id, req.user.id, req.params.userId);
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new DocumentController();
