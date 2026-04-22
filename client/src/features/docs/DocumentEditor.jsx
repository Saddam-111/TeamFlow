import { useState, useEffect, useRef, useCallback } from 'react';
import { useDocumentStore } from '../../store/document.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { documentAPI } from '../../services/api';
import socketService from '../../services/socket';

export function DocumentEditor() {
  const { currentDocument, setCurrentDocument, updateDocument } = useDocumentStore();
  const { currentWorkspace, members } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const lastLoadedDocId = useRef(null);

  useEffect(() => {
    if (currentDocument && currentDocument._id !== lastLoadedDocId.current) {
      lastLoadedDocId.current = currentDocument._id;
      setContent(currentDocument.content || '');
      setTitle(currentDocument.title || 'Untitled');
      
      if (currentWorkspace?._id && currentDocument._id) {
        socketService.joinDocument(currentWorkspace._id, currentDocument._id);
      }
    }
    return () => {
      if (currentDocument?._id) {
        socketService.leaveDocument(currentDocument._id);
      }
    };
  }, [currentDocument?._id, currentWorkspace?._id]);

  useEffect(() => {
    const handleRemoteChange = (data) => {
      if (currentDocument && data.documentId === currentDocument._id && data.userId !== user._id) {
        setContent(data.content);
      }
    };

    socketService.on('document-changed', handleRemoteChange);
    return () => socketService.off('document-changed', handleRemoteChange);
  }, [currentDocument, user._id]);

  const handleRemoteChange = useCallback((data) => {
    if (currentDocument && data.documentId === currentDocument._id && data.userId !== user._id) {
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
    if (!currentDocument || !currentWorkspace || isSaving) return;
    setIsSaving(true);
    try {
      await documentAPI.update(currentWorkspace._id, currentDocument._id, { content: contentToSave });
      updateDocument(currentDocument._id, { content: contentToSave });
      
      socketService.updateDocument(
        currentDocument._id,
        contentToSave,
        null,
        user._id
      );
    } catch (err) {
      console.error('Failed to save document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    if (!currentDocument || !currentWorkspace || isSaving) return;
    setIsSaving(true);
    try {
      await documentAPI.update(currentWorkspace._id, currentDocument._id, { title: newTitle });
      updateDocument(currentDocument._id, { title: newTitle });
      
      socketService.updateDocument(
        currentDocument._id,
        content,
        null,
        user._id
      );
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
          <h2 className="text-lg font-bold uppercase text-white/40">Select a Document</h2>
          <p className="text-white/30 text-sm mt-2">Choose a document to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-black h-full overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-base sm:text-lg font-bold uppercase bg-transparent outline-none border-none focus:ring-0 text-white"
        />
        {isSaving && <span className="text-white/30 text-xs font-mono">Saving...</span>}
      </div>

      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto custom-scrollbar">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing..."
          className="w-full h-full bg-transparent outline-none resize-none text-sm sm:text-base leading-relaxed text-white/80 placeholder:text-white/20"
        />
      </div>
    </div>
  );
}