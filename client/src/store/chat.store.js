import { create } from 'zustand';

const generateUniqueId = () => {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const useChatStore = create((set, get) => ({
  messages: [],
  typingUsers: {},
  isLoading: false,
  
  setMessages: (messages) => set({ messages: messages.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) }),
  
  setLoading: (isLoading) => set({ isLoading }),
   
  addMessage: (message) => set((state) => {
    const msgId = message._id || message.id;
    const exists = state.messages.some(m => {
      const existingId = m._id || m.id;
      if (existingId === msgId) return true;
      if (existingId?.startsWith('temp-') && msgId?.startsWith('temp-')) {
        return existingId === msgId;
      }
      return false;
    });
    if (exists) {
      return state;
    }
    
    const newMessages = [...state.messages, message];
    return { 
      messages: newMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    };
  }),
  
  updateMessage: (messageId, updates) => set((state) => ({ 
    messages: state.messages.map(m => {
      const msgId = m._id || m.id;
      if (msgId === messageId || (messageId.startsWith('temp-') && msgId === messageId)) {
        return { ...m, ...updates };
      }
      return m;
    }) 
  })),

  removeMessage: (messageId) => set((state) => ({ 
    messages: state.messages.filter(m => {
      const msgId = m._id || m.id;
      return msgId !== messageId && !(messageId.startsWith('temp-') && msgId === messageId);
    }) 
  })),
  
  replaceMessage: (oldId, newMessage) => set((state) => {
    const newId = newMessage._id || newMessage.id;
    const newMessages = state.messages.map(m => {
      const msgId = m._id || m.id;
      if (msgId === oldId || (oldId.startsWith('temp-') && msgId === oldId)) {
        return { ...newMessage, _id: newId };
      }
      return m;
    });
    return { messages: newMessages };
  }),
  
  setTypingUser: (channelId, userId, isTyping, username) => set((state) => {
    const current = state.typingUsers[channelId] || [];
    const filtered = current.filter(u => u.id !== userId);
    return {
      typingUsers: {
        ...state.typingUsers,
        [channelId]: isTyping 
          ? [...filtered, { id: userId, username }]
          : filtered
      }
    };
  }),
  
  clearTypingUsers: (channelId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [channelId]: []
    }
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  getTypingUsers: (channelId) => {
    const { typingUsers } = get();
    return typingUsers[channelId] || [];
  }
}));