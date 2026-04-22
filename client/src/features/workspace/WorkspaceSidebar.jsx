import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspace.store.js';
import { useAuthStore } from '../../store/auth.store.js';
import { workspaceAPI } from '../../services/api.js';

export function WorkspaceSidebar() {
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
  const [joinCode, setJoinCode] = useState({ workspaceId: '', code: '' });
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { 
    workspaces, 
    currentWorkspace, 
    setWorkspaces, 
    setCurrentWorkspace,
    channels,
    setChannels,
    setMembers
  } = useWorkspaceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaceAPI.getAll();
      setWorkspaces(response.data);
    } catch (err) {
      console.error('Failed to load workspaces:', err);
    }
  };

  const sortedWorkspaces = useMemo(() => {
    if (!user) return workspaces;
    return [...workspaces].map(ws => ({
      ...ws,
      isOwner: ws.createdBy === user._id
    })).sort((a, b) => {
      if (a.isOwner && !b.isOwner) return -1;
      if (!a.isOwner && b.isOwner) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [workspaces, user]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await workspaceAPI.create(newWorkspace);
      setWorkspaces([...workspaces, response.data]);
      setCurrentWorkspace(response.data);
      setInviteData({ 
        workspaceId: response.data._id, 
        inviteCode: response.data.inviteCode,
        name: response.data.name 
      });
      setShowInviteModal(true);
      setIsCreating(false);
      setNewWorkspace({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace');
    }
  };

  const handleRegenerateCode = async () => {
    if (!currentWorkspace) return;
    try {
      const response = await workspaceAPI.regenerateCode(currentWorkspace._id);
      setInviteData({ 
        workspaceId: currentWorkspace._id, 
        inviteCode: response.data.inviteCode,
        name: currentWorkspace.name 
      });
      setShowInviteModal(true);
    } catch (err) {
      console.error('Failed to regenerate code:', err);
    }
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await workspaceAPI.join(joinCode.workspaceId, joinCode.code);
      const response = await workspaceAPI.getById(joinCode.workspaceId);
      setWorkspaces([...workspaces, response.data]);
      setCurrentWorkspace(response.data);
      setShowJoinModal(false);
      setJoinCode({ workspaceId: '', code: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join workspace');
    }
  };

  const selectWorkspace = async (workspace) => {
    setCurrentWorkspace(workspace);
    try {
      const response = await workspaceAPI.getById(workspace._id);
      const workspaceData = response.data;
      setChannels(workspaceData.channels || []);
      setMembers(workspaceData.members || []);
      
      setCurrentWorkspace({
        ...workspace,
        owner: workspaceData.owner,
        createdBy: workspaceData.createdBy,
        members: workspaceData.members || []
      });
    } catch (err) {
      setChannels([]);
      setMembers([]);
      console.error('Failed to load workspace:', err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden flex-shrink-0 bg-obsidian/30 border-r border-white/[0.06]">
      <div className="p-3 sm:p-4 border-b border-white/[0.06] flex-shrink-0">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-lime-accent mb-3 sm:mb-4 font-mono">
          Workspaces
        </h2>
        <div className="space-y-1">
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 px-2 hover:bg-white/[0.06] transition-colors rounded"
          >
            + Join a Workspace
          </button>
          {currentWorkspace && (
            <button
              onClick={handleRegenerateCode}
              className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 px-2 hover:bg-white/[0.06] transition-colors text-lime-accent rounded"
            >
              Get Code
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1 sm:p-2 custom-scrollbar">
        {sortedWorkspaces.map((workspace) => (
          <button
            key={workspace._id}
            onClick={() => selectWorkspace(workspace)}
            className={`w-full text-left p-2 sm:p-3 mb-1 transition-colors text-xs sm:text-sm rounded ${
              currentWorkspace?._id === workspace._id
                ? 'bg-lime-accent text-black'
                : workspace.isOwner 
                  ? 'bg-emerald-glow/10 hover:bg-emerald-glow/20 text-emerald-glow' 
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span className="font-bold uppercase tracking-wider text-xs">
              {workspace.name} {workspace.isOwner && '(Owner)'}
            </span>
          </button>
        ))}
      </div>

      <div className="p-2 border-t border-white/[0.06] flex-shrink-0">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 px-2 hover:bg-white/[0.06] transition-colors rounded"
        >
          + Create own Workspace
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="glass border border-white/10 p-5 sm:p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold uppercase mb-4">Create Workspace</h3>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <input
                type="text"
                placeholder="WORKSPACE NAME"
                value={newWorkspace.name}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                className="input-field text-sm"
                required
              />
              <textarea
                placeholder="DESCRIPTION (OPTIONAL)"
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
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

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="glass border border-white/10 p-5 sm:p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold uppercase mb-4">Join Workspace</h3>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <form onSubmit={handleJoinWorkspace} className="space-y-4">
              <input
                type="text"
                placeholder="WORKSPACE ID"
                value={joinCode.workspaceId}
                onChange={(e) => setJoinCode({ ...joinCode, workspaceId: e.target.value })}
                className="input-field text-sm"
                required
              />
              <input
                type="text"
                placeholder="INVITE CODE"
                value={joinCode.code}
                onChange={(e) => setJoinCode({ ...joinCode, code: e.target.value })}
                className="input-field text-sm"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 text-sm">JOIN</button>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2.5 border border-white/10 hover:bg-white/[0.06] uppercase font-bold tracking-wider text-sm"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && inviteData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="glass border border-white/10 p-5 sm:p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold uppercase mb-3">Invite Members</h3>
            <p className="text-white/40 text-xs sm:text-sm mb-4">Share these details with others to join "{inviteData.name}"</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-white/30 mb-1">Workspace ID</label>
                <input
                  type="text"
                  value={inviteData.workspaceId}
                  readOnly
                  className="input-field text-sm bg-white/[0.06]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-white/30 mb-1">Invite Code</label>
                <input
                  type="text"
                  value={inviteData.inviteCode}
                  readOnly
                  className="input-field text-sm bg-white/[0.06]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(inviteData.inviteCode);
                }}
                className="btn-primary flex-1 text-sm"
              >
                COPY CODE
              </button>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2.5 border border-white/10 hover:bg-white/[0.06] uppercase font-bold tracking-wider text-sm"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}