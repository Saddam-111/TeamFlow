import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chat.store';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useAuthStore } from '../../store/auth.store';
import { channelAPI } from '../../services/api';
import socketService from '../../services/socket';

export function ChannelList() {
  const { currentWorkspace, channels, setChannels, setCurrentChannel } = useWorkspaceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: '', type: 'text', description: '' });
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (currentWorkspace?._id) {
      loadChannels();
    }
  }, [currentWorkspace?._id]);

  const loadChannels = async () => {
    if (!currentWorkspace?._id) return;
    try {
      const response = await channelAPI.getAll(currentWorkspace._id);
      setChannels(response.data || []);
    } catch (err) {
      console.error('Failed to load channels:', err);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const response = await channelAPI.create(currentWorkspace._id, newChannel);
      setChannels([...channels, response.data]);
      setIsCreating(false);
      setNewChannel({ name: '', type: 'text', description: '' });
    } catch (err) {
      console.error('Failed to create channel:', err);
    }
  };

  return (
    <div className="w-48 md:w-56 bg-surface border-r border-surface-light h-full flex flex-col overflow-hidden flex-shrink-0">
      <div className="p-2 md:p-3 border-b border-surface-light flex-shrink-0 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Channels
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white text-sm p-1"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-1 md:p-2 custom-scrollbar">
            {channels.map((channel) => (
              <button
                key={channel._id}
                onClick={() => setCurrentChannel(channel)}
                className="w-full text-left p-2 mb-1 text-xs md:text-sm hover:bg-surface-light transition-colors font-medium"
              >
                # {channel.name}
              </button>
            ))}
          </div>

          <div className="p-1 md:p-2 border-t border-surface-light flex-shrink-0">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-left text-xs md:text-sm font-bold uppercase py-2 px-2 hover:bg-surface-light transition-colors"
            >
              + Add
            </button>
          </div>
        </>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-surface border border-surface-light p-6 w-full max-w-md">
            <h3 className="text-h3 font-bold uppercase mb-4">Create Channel</h3>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <input
                type="text"
                placeholder="CHANNEL NAME"
                value={newChannel.name}
                onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="input-field"
                required
              />
              <select
                value={newChannel.type}
                onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value })}
                className="input-field"
              >
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
              <textarea
                placeholder="DESCRIPTION"
                value={newChannel.description}
                onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                className="input-field h-20 resize-none"
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
