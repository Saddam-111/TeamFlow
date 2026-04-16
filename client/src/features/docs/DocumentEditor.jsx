import { useState, useEffect, useRef, useCallback } from 'react';
import { useDocumentStore } from '../../store/document.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { documentAPI } from '../../services/api';
import socketService from '../../services/socket';

export function DocumentEditor() {
  const { currentDocument, setCurrentDocument, updateDocument } = useDocumentStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (currentDocument) {
      setContent(currentDocument.content || '');
      setTitle(currentDocument.title || 'Untitled');
      socketService.joinDocument(currentWorkspace._id, currentDocument._id);
    }
    return () => {
      if (currentDocument) {
        socketService.leaveDocument(currentDocument._id);
      }
    };
  }, [currentDocument?._id, currentWorkspace?._id]);

  useEffect(() => {
    socketService.on('document-changed', handleRemoteChange);
    return () => socketService.off('document-changed');
  }, []);

  const handleRemoteChange = useCallback((data) => {
    if (data.documentId === currentDocument._id && data.userId !== user._id) {
      setContent(data.content);
    }
  }, [currentDocument, user._id]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newContent);
    }, 1000);
  };

  const saveDocument = async (contentToSave) => {
    if (!currentDocument || isSaving) return;
    setIsSaving(true);
    try {
      const response = await documentAPI.update(currentWorkspace._id, currentDocument._id, { content: contentToSave });
      updateDocument(currentDocument._id, { content: contentToSave });
    } catch (err) {
      console.error('Failed to save document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    if (!currentDocument || isSaving) return;
    setIsSaving(true);
    try {
      await documentAPI.update(currentWorkspace._id, currentDocument._id, { title: newTitle });
      updateDocument(currentDocument._id, { title: newTitle });
    } catch (err) {
      console.error('Failed to update title:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentDocument) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-black">
        <div className="text-center">
          <h2 className="text-h2 font-bold uppercase text-gray-500">Select a Document</h2>
          <p className="text-gray-400 mt-2">Choose a document to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-black h-full overflow-hidden">
      <div className="p-4 border-b border-surface-light flex items-center justify-between flex-shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-h2 font-bold uppercase bg-transparent outline-none border-none focus:ring-0"
        />
        {isSaving && <span className="text-gray-500 text-sm">Saving...</span>}
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-auto custom-scrollbar">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing..."
          className="w-full h-full bg-transparent outline-none resize-none text-lg leading-relaxed"
        />
      </div>
    </div>
  );
}
