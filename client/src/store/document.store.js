import { create } from 'zustand';

export const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDocument: null,
  collaborators: [],
  isLoading: false,
  
  setDocuments: (documents) => set({ documents }),
  
  setCurrentDocument: (document) => set({ currentDocument: document }),
  
  setCollaborators: (collaborators) => set({ collaborators }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document] 
  })),
  
  updateDocument: (documentId, updates) => set((state) => ({ 
    documents: state.documents.map(d => d._id === documentId ? { ...d, ...updates } : d),
    currentDocument: state.currentDocument?._id === documentId 
      ? { ...state.currentDocument, ...updates } 
      : state.currentDocument
  })),
  
  removeDocument: (documentId) => set((state) => ({ 
    documents: state.documents.filter(d => d._id !== documentId)
  }))
}));
