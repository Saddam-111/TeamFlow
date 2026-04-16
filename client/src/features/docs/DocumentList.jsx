import { useState, useEffect, useRef } from 'react';
import { useDocumentStore } from '../../store/document.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { documentAPI } from '../../services/api';
import socketService from '../../services/socket';

export function DocumentList() {
  const { documents, setDocuments, setCurrentDocument, addDocument } = useDocumentStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: 'Untitled' });
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (currentWorkspace?._id) {
      loadDocuments();
    }
  }, [currentWorkspace?._id]);

  const loadDocuments = async () => {
    if (!currentWorkspace?._id) return;
    try {
      const response = await documentAPI.getAll(currentWorkspace._id);
      setDocuments(response.data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await documentAPI.create(currentWorkspace._id, newDoc);
      addDocument(response.data);
      setCurrentDocument(response.data);
      setIsCreating(false);
      setNewDoc({ title: 'Untitled' });
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  return (
    <div className="w-44 md:w-56 bg-surface border-r border-surface-light h-full flex flex-col overflow-hidden flex-shrink-0">
      <div className="p-2 md:p-3 border-b border-surface-light flex-shrink-0 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Docs</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white text-sm p-1"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-1 md:p-2">
            {documents.map((doc) => (
              <button
                key={doc._id}
                onClick={() => setCurrentDocument(doc)}
                className="w-full text-left p-2 mb-1 text-sm hover:bg-surface-light transition-colors font-medium"
              >
                {doc.title}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-surface-light flex-shrink-0">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-left text-sm font-bold uppercase py-2 px-2 hover:bg-surface-light transition-colors"
            >
              + New Document
            </button>
          </div>
        </>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-surface border border-surface-light p-6 w-full max-w-md">
            <h3 className="text-h3 font-bold uppercase mb-4">Create Document</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="DOCUMENT TITLE"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ title: e.target.value })}
                className="input-field"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">CREATE</button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 border border-surface-light hover:bg-surface-light uppercase font-bold tracking-wider"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
