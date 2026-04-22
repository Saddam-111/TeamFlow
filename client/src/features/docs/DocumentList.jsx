import { useState, useEffect, useRef } from 'react';
import { useDocumentStore } from '../../store/document.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { documentAPI } from '../../services/api';

export function DocumentList() {
  const { documents, setDocuments, setCurrentDocument, addDocument } = useDocumentStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: 'Untitled' });
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSelectDocument = async (doc) => {
    if (!currentWorkspace?._id || isLoading) return;
    setIsLoading(true);
    try {
      const response = await documentAPI.getById(currentWorkspace._id, doc._id);
      setCurrentDocument(response.data);
    } catch (err) {
      console.error('Failed to load document:', err);
      setCurrentDocument(doc);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await documentAPI.create(currentWorkspace._id, newDoc);
      const fullDocResponse = await documentAPI.getById(currentWorkspace._id, response.data._id);
      addDocument(fullDocResponse.data);
      setCurrentDocument(fullDocResponse.data);
      setIsCreating(false);
      setNewDoc({ title: 'Untitled' });
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden flex-shrink-0 bg-obsidian/30 border-r border-white/[0.06]">
      <div className="p-2 sm:p-3 border-b border-white/[0.06] flex-shrink-0 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 font-mono">Docs</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/30 hover:text-white text-xs p-1 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-1 sm:p-2 custom-scrollbar">
            {documents.length === 0 ? (
              <p className="text-white/30 text-xs p-2">No documents</p>
            ) : (
              documents.map((doc) => (
                <button
                  key={doc._id}
                  onClick={() => handleSelectDocument(doc)}
                  disabled={isLoading}
                  className="w-full text-left p-2 mb-1 text-xs sm:text-sm hover:bg-white/[0.06] transition-colors font-mono text-white/60 hover:text-white rounded disabled:opacity-50"
                >
                  {doc.title}
                </button>
              ))
            )}
          </div>

          <div className="p-2 border-t border-white/[0.06] flex-shrink-0">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-left text-xs font-bold uppercase py-2 px-2 hover:bg-white/[0.06] transition-colors rounded"
            >
              + New Document
            </button>
          </div>
        </>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="glass border border-white/10 p-5 sm:p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold uppercase mb-4">Create Document</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="DOCUMENT TITLE"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ title: e.target.value })}
                className="input-field text-sm"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 text-sm">CREATE</button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 border border-white/10 hover:bg-white/[0.06] uppercase font-bold tracking-wider text-sm"
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