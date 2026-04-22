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
    <div className="w-full h-full flex flex-col overflow-hidden flex-shrink-0 bg-obsidian/30 border-r border-white/[0.06]">
      <div className="p-2 sm:p-3 border-b border-white/[0.06] flex-shrink-0 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 font-mono">
          Channels
        </h3>
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
            {channels.length === 0 ? (
              <p className="text-white/30 text-xs p-2">No channels</p>
            ) : (
              channels.map((channel) => (
                <button
                  key={channel._id}
                  onClick={() => setCurrentChannel(channel)}
                  className="w-full text-left p-2 mb-1 text-xs sm:text-sm hover:bg-white/[0.06] transition-colors font-mono text-white/60 hover:text-white rounded"
                >
                  # {channel.name}
                </button>
              ))
            )}
          </div>

          <div className="p-2 border-t border-white/[0.06] flex-shrink-0">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-left text-xs font-bold uppercase py-2 px-2 hover:bg-white/[0.06] transition-colors rounded"
            >
              + Add
            </button>
          </div>
        </>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="glass border border-white/10 p-5 sm:p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold uppercase mb-4">Create Channel</h3>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <input
                type="text"
                placeholder="CHANNEL NAME"
                value={newChannel.name}
                onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="input-field text-sm"
                required
              />
              <select
                value={newChannel.type}
                onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value })}
                className="input-field text-sm"
              >
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
              <textarea
                placeholder="DESCRIPTION"
                value={newChannel.description}
                onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                className="input-field h-20 resize-none text-sm"
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