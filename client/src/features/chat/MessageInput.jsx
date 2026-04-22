import { useState, useRef } from 'react';
import { useChatStore } from '../../store/chat.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { channelAPI, uploadAPI } from '../../services/api';
import socketService from '../../services/socket';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [sendError, setSendError] = useState('');
  const fileInputRef = useRef(null);
  
  const { currentChannel, currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { addMessage, replaceMessage, removeMessage } = useChatStore();
  const typingTimeoutRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('files', file);
        
        const response = await uploadAPI.media(formData);
        if (response.data.files) {
          uploadedUrls.push(...response.data.files.map(f => f.url));
        }
      }
      
      setAttachments(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Failed to upload files:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (retryCount = 0) => {
    if ((!message.trim() && attachments.length === 0) || !currentChannel || isSending) return;
    
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const tempMessage = {
      _id: tempId,
      content: message,
      sender: { _id: user._id, username: user.username },
      channelId: currentChannel._id,
      createdAt: new Date().toISOString(),
      attachments: attachments,
      isOptimistic: true,
      status: 'sent'
    };
    
    addMessage(tempMessage);
    setMessage('');
    setAttachments([]);
    setIsSending(true);
    
    try {
      const response = await channelAPI.createMessage(currentWorkspace._id, currentChannel._id, {
        content: message,
        attachments: attachments.length > 0 ? attachments : undefined
      });
      
      const createdMessage = response.data;
      
      if (!createdMessage || !createdMessage._id) {
        throw new Error('Invalid response from server');
      }
      
      replaceMessage(tempId, createdMessage);
      
      const messageAttachments = (createdMessage?.attachments?.length > 0) 
        ? createdMessage.attachments 
        : (attachments.length > 0 ? attachments : null);
          
      socketService.sendMessage(
        currentChannel._id,
        createdMessage.content || message,
        { _id: user._id, username: user.username },
        null,
        messageAttachments,
        createdMessage._id
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
      
      if (errorMessage.includes('duplicate') && retryCount < 2) {
        console.log(`Retrying message send (attempt ${retryCount + 1})...`);
        removeMessage(tempId);
        setIsSending(false);
        setTimeout(() => handleSend(retryCount + 1), 100);
        return;
      }
      
      removeMessage(tempId);
      setSendError(errorMessage);
      setTimeout(() => setSendError(''), 3000);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    if (currentChannel?._id && user?._id) {
      socketService.sendTyping(currentChannel._id, user._id, user.username, true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (currentChannel?._id && user?._id) {
        socketService.sendTyping(currentChannel._id, user._id, user.username, false);
      }
    }, 1000);
  };

  if (!currentChannel) return null;

  return (
    <div className="p-3 sm:p-4 border-t border-white/[0.06] flex-shrink-0">
      {sendError && (
        <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {sendError}
        </div>
      )}
      
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {attachments.map((url, index) => (
            <div key={index} className="relative group">
              {url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img 
                  src={url} 
                  alt="preview" 
                  className="w-14 h-14 object-cover rounded border border-white/10"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center bg-white/[0.06] rounded border border-white/10">
                  📎
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
          title="Attach media"
        >
          {isUploading ? '⏳' : '📎'}
        </button>
        
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${currentChannel.name}`}
          className="input-field flex-1 text-sm"
          disabled={isSending}
        />
        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || isSending}
          className="btn-primary text-sm py-2.5 px-4"
        >
          SEND
        </button>
      </div>
    </div>
  );
}