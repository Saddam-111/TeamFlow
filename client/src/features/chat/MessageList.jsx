import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chat.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { channelAPI } from '../../services/api';
import socketService from '../../services/socket';

export function MessageList() {
  const { messages, setMessages, addMessage, typingUsers, setTypingUser, clearMessages, updateMessage, removeMessage } = useChatStore();
  const { currentChannel, currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  const lastLoadedChannelRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlinePopup, setOnlinePopup] = useState(null);

  useEffect(() => {
    if (currentChannel?._id && currentWorkspace?._id && lastLoadedChannelRef.current !== currentChannel._id) {
      lastLoadedChannelRef.current = currentChannel._id;
      clearMessages();
      loadMessages();
      socketService.joinChannel(currentWorkspace._id, currentChannel._id);
    }
    return () => {
      if (currentChannel?._id) {
        socketService.leaveChannel(currentChannel._id);
      }
    };
  }, [currentChannel?._id, currentWorkspace?._id]);

  useEffect(() => {
    setIsWorkspaceOwner(currentWorkspace?.owner === user?._id || currentWorkspace?.createdBy === user?._id);
  }, [currentWorkspace, user]);

  useEffect(() => {
    if (!currentChannel?._id) return;
    
    const handleNewMessage = (message) => {
      const msgChannelId = message.channelId || message.channel;
      if (msgChannelId === currentChannel._id) {
        const senderId = message.sender?._id || message.sender;
        const isMyMessage = senderId === user?._id;
        
        if (isMyMessage) return;
        
        const msgWithStatus = {
          ...message,
          _id: message.messageId || message._id,
          status: 'delivered'
        };
        addMessage(msgWithStatus);
        
        const msgId = message.messageId || message._id;
        if (msgId) {
          socketService.sendMessageDelivered(currentChannel._id, msgId, user._id);
        }
      }
    };

    const handleUserTyping = ({ channelId, userId, username, isTyping }) => {
      if (channelId === currentChannel._id && userId !== user?._id) {
        setTypingUser(channelId, userId, isTyping, username);
      }
    };

    const handleMessageUpdated = (data) => {
      const msgChannelId = data.channelId || data.channel;
      if (msgChannelId === currentChannel._id) {
        const msgId = data.messageId || data._id;
        updateMessage(msgId, { content: data.content, isEdited: true });
      }
    };

    const handleMessageDeleted = (data) => {
      const msgChannelId = data.channelId || data.channel;
      if (msgChannelId === currentChannel._id) {
        const msgId = data.messageId || data._id;
        removeMessage(msgId);
      }
    };

    const handleUserOnline = (data) => {
      if (data.userId !== user?._id) {
        setOnlinePopup(`${data.username} is online`);
        setTimeout(() => setOnlinePopup(null), 2000);
        setOnlineUsers(prev => [...prev.filter(u => u !== data.userId), data.userId]);
      }
    };

    const handleUserOffline = (data) => {
      setOnlineUsers(prev => prev.filter(u => u !== data.userId));
      setOnlinePopup(`${data.userId} went offline`);
      setTimeout(() => setOnlinePopup(null), 2000);
    };

    const handleMessageStatusUpdated = (data) => {
      const msgChannelId = data.channelId || data.channel;
      if (msgChannelId === currentChannel._id && data.messageId) {
        const msgId = data.messageId || data._id;
        updateMessage(msgId, { status: data.status });
      }
    };

    socketService.on('new-message', handleNewMessage);
    socketService.on('user-typing', handleUserTyping);
    socketService.on('message-updated', handleMessageUpdated);
    socketService.on('message-deleted', handleMessageDeleted);
    socketService.on('user-online', handleUserOnline);
    socketService.on('user-offline', handleUserOffline);
    socketService.on('message-status-updated', handleMessageStatusUpdated);

    return () => {
      socketService.off('new-message');
      socketService.off('user-typing');
      socketService.off('message-updated');
      socketService.off('message-deleted');
      socketService.off('user-online');
      socketService.off('user-offline');
      socketService.off('message-status-updated');
    };
  }, [currentChannel?._id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 0 && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length]);

  useEffect(() => {
    if (!messages.length || !currentChannel?._id || !user?._id) return;
    
    const otherUserMessages = messages
      .filter(m => {
        const senderId = m.sender?._id || m.sender;
        return senderId && senderId !== user._id;
      });
    
    otherUserMessages.forEach(msg => {
      if (msg.status === 'sent') {
        socketService.sendMessageDelivered(currentChannel._id, msg._id || msg.id, user._id);
        setTimeout(() => {
          socketService.sendMessageRead(currentChannel._id, msg._id || msg.id, user._id);
        }, 1500);
      }
    });
  }, [messages.length]);

  const loadMessages = async () => {
    if (!currentChannel?._id || !currentWorkspace?._id) return;
    try {
      const response = await channelAPI.getMessages(currentWorkspace._id, currentChannel._id);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
  };

  const handleSaveEdit = async (messageId) => {
    if (!editContent.trim()) return;
    try {
      await channelAPI.updateMessage(currentWorkspace._id, currentChannel._id, messageId, { content: editContent });
      updateMessage(messageId, { content: editContent, isEdited: true });
      setEditingMessageId(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Delete this message?')) return;
    try {
      await channelAPI.deleteMessage(currentWorkspace._id, currentChannel._id, messageId);
      removeMessage(messageId);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const canEditMessage = (message) => {
    const isMyMessage = message.sender?._id === user?._id || message.sender === user?._id;
    const hasOnlyMedia = message.attachments?.length > 0 && !message.content?.trim();
    return isMyMessage && !hasOnlyMedia;
  };

  const canDeleteMessage = (message) => {
    const isMyMessage = message.sender?._id === user?._id || message.sender === user?._id;
    return isMyMessage || isWorkspaceOwner;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFileIcon = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return '🎬';
    if (['pdf'].includes(ext)) return '📄';
    return '📎';
  };

  const isImageFile = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold uppercase text-white/40">Select a Channel</h2>
          <p className="text-white/30 text-sm mt-2">Choose a channel to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-black h-full overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-white/[0.06] flex-shrink-0 flex justify-between items-start">
        <div>
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            # {currentChannel.name}
          </h2>
          {currentChannel.description && (
            <p className="text-white/40 text-xs sm:text-sm mt-0.5 hidden md:block">{currentChannel.description}</p>
          )}
        </div>
        {onlineUsers.length > 0 && (
          <div className="text-xs text-emerald-glow font-mono">
            • {onlineUsers.length + 1} online
          </div>
        )}
        {onlinePopup && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-emerald-glow/20 text-emerald-glow px-4 py-1.5 rounded-full text-xs font-medium shadow-glow-sm animate-pulse z-50">
            {onlinePopup}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 custom-scrollbar">
        {messages.map((message) => {
          const isMyMessage = message.sender?._id === user?._id || message.sender === user?._id;
          const canEdit = canEditMessage(message);
          const canDelete = canDeleteMessage(message);

          return (
            <div 
              key={message._id || message.id} 
              className={`flex gap-2 sm:gap-3 group ${isMyMessage ? 'flex-row-reverse' : ''}`}
            >
              {!isMyMessage && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-lime-accent rounded-sm flex-shrink-0 flex items-center justify-center font-bold text-black text-xs">
                  {message.sender?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className={`flex-1 max-w-[70%] sm:max-w-[60%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                {!isMyMessage && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lime-accent text-xs sm:text-sm">
                      {message.sender?.username || 'Unknown'}
                    </span>
                    {message.isEdited && (
                      <span className="text-white/30 text-xs">(edited)</span>
                    )}
                  </div>
                )}
                
                {editingMessageId === message._id ? (
                  <div className="w-full">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-white/[0.06] text-white p-2 rounded text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(message._id)}
                        className="px-2 py-1 bg-lime-accent text-black text-xs rounded font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-white/[0.1] text-white/60 text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg ${
                      isMyMessage 
                        ? 'bg-lime-accent text-black rounded-br-sm' 
                        : 'bg-white/[0.06] text-white rounded-bl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap text-xs sm:text-sm">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((url, index) => (
                            <div key={index}>
                              {isImageFile(url) ? (
                                <img 
                                  src={url} 
                                  alt="attachment" 
                                  className="max-w-full rounded border border-white/10"
                                  onClick={() => window.open(url, '_blank')}
                                />
                              ) : (
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-lime-accent hover:underline"
                                >
                                  <span>{getFileIcon(url)}</span>
                                  <span className="text-xs">Attachment {index + 1}</span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/30 text-xs">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.isEdited && (
                        <span className="text-white/30 text-xs">(edited)</span>
                      )}
                      {isMyMessage && message.status && (
                        <span className="text-xs">
                          {message.status === 'sent' && <span className="text-white/40">✓</span>}
                          {message.status === 'delivered' && <span className="text-white/60">✓✓</span>}
                          {message.status === 'read' && <span className="text-lime-accent">✓✓</span>}
                        </span>
                      )}
                      
                      {(canEdit || canDelete) && (
                        <div className="hidden group-hover:flex gap-2 ml-2">
                          {canEdit && (
                            <button
                              onClick={() => handleEditMessage(message)}
                              className="text-white/40 hover:text-white text-xs"
                            >
                              ✏️ Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteMessage(message._id)}
                              className="text-white/40 hover:text-red-400 text-xs"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {(() => {
        const typingInChannel = typingUsers[currentChannel._id] || [];
        const otherTyping = typingInChannel.filter(u => u.id !== user?._id);
        if (otherTyping.length === 0) return null;
        const names = otherTyping.map(u => u.username).join(', ');
        return (
          <div className="px-4 py-2 text-white/40 text-xs flex items-center gap-2 flex-shrink-0">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </span>
            <span>{otherTyping.length === 1 ? names : `${otherTyping.length} users`} typing...</span>
          </div>
        );
      })()}
    </div>
  );
}