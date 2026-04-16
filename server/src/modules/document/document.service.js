import Document from './document.model.js';

class DocumentService {
  async createDocument(data) {
    const document = await Document.create({
      ...data,
      collaborators: []
    });
    return this.getDocumentById(document._id);
  }

  async getDocumentById(id) {
    return Document.findById(id)
      .populate('owner', 'username avatar email')
      .populate('collaborators.user', 'username avatar email');
  }

  async getDocumentsByWorkspace(workspaceId) {
    return Document.find({ workspace: workspaceId })
      .populate('owner', 'username avatar email')
      .select('title workspace owner createdAt updatedAt version');
  }

  async updateDocument(documentId, userId, updateData) {
    const document = await Document.findById(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    const isOwner = document.owner.toString() === userId;
    const collaborator = document.collaborators.find(c => c.user.toString() === userId);
    const canEdit = isOwner || (collaborator && collaborator.permission === 'edit');

    if (!canEdit) {
      throw new Error('Not authorized to edit this document');
    }

    const allowedUpdates = ['title', 'content', 'isPublic'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        filteredUpdates[key] = updateData[key];
      }
    }

    filteredUpdates.version = document.version + 1;

    return Document.findByIdAndUpdate(documentId, filteredUpdates, { new: true })
      .populate('owner', 'username avatar email')
      .populate('collaborators.user', 'username avatar email');
  }

  async deleteDocument(documentId, userId) {
    const document = await Document.findById(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.owner.toString() !== userId.toString()) {
      throw new Error('Only owner can delete this document');
    }

    return Document.findByIdAndDelete(documentId);
  }

  async addCollaborator(documentId, ownerId, userId, permission = 'view') {
    const document = await Document.findById(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.owner.toString() !== ownerId.toString()) {
      throw new Error('Only owner can add collaborators');
    }

    const existingCollaborator = document.collaborators.find(
      c => c.user.toString() === userId.toString()
    );

    if (existingCollaborator) {
      existingCollaborator.permission = permission;
    } else {
      document.collaborators.push({ user: userId, permission });
    }

    return document.save();
  }

  async removeCollaborator(documentId, ownerId, userId) {
    const document = await Document.findById(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.owner.toString() !== ownerId.toString()) {
      throw new Error('Only owner can remove collaborators');
    }

    document.collaborators = document.collaborators.filter(
      c => c.user.toString() !== userId.toString()
    );

    return document.save();
  }

  async searchDocuments(query, workspaceId) {
    return Document.find({
      workspace: workspaceId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).populate('owner', 'username avatar email').limit(50);
  }
}

export default new DocumentService();
