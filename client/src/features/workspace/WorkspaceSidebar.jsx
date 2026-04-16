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
    console.log('Selecting workspace:', workspace._id);
    setCurrentWorkspace(workspace);
    try {
      const response = await workspaceAPI.getById(workspace._id);
      const workspaceData = response.data;
      console.log('Workspace response:', workspaceData);
      setChannels(workspaceData.channels || []);
      setMembers(workspaceData.members || []);
      
      // Update current workspace with full data including owner/createdBy
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
    <div className="w-52 md:w-64 bg-surface border-r border-surface-light h-full flex-shrink-0 flex flex-col overflow-hidden">
      <div className="p-3 md:p-4 border-b border-surface-light flex-shrink-0">
        <h2 className="text-base md:text-h3 font-bold uppercase tracking-tight text-acid-yellow mb-3 md:mb-4">
          Workspaces
        </h2>
        <div className="space-y-1 md:space-y-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full text-left text-xs md:text-sm font-bold uppercase tracking-wider py-2 px-3 hover:bg-surface-light transition-colors"
          >
            + Join a Workspace
          </button>
          {currentWorkspace && (
            <button
              onClick={handleRegenerateCode}
              className="w-full text-left text-xs md:text-sm font-bold uppercase tracking-wider py-2 px-3 hover:bg-surface-light transition-colors text-acid-yellow"
            >
              Get Code
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1 md:p-2 custom-scrollbar">
        {sortedWorkspaces.map((workspace) => (
          <button
            key={workspace._id}
            onClick={() => selectWorkspace(workspace)}
            className={`w-full text-left p-2 md:p-3 mb-1 transition-colors text-sm ${
              currentWorkspace?._id === workspace._id
                ? 'bg-acid-yellow text-black'
                : workspace.isOwner 
                  ? 'bg-green-900/50 hover:bg-green-900 text-green-400' 
                  : 'hover:bg-surface-light'
            }`}
          >
            <span className="font-bold uppercase tracking-wider text-xs md:text-sm">
              {workspace.name} {workspace.isOwner && '(Owner)'}
            </span>
          </button>
        ))}
      </div>

      <div className="p-2 border-t border-surface-light flex-shrink-0">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full text-left text-xs md:text-sm font-bold uppercase tracking-wider py-2 px-3 hover:bg-surface-light transition-colors"
        >
          + Create own Workspace
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-surface border border-surface-light p-6 w-full max-w-md">
            <h3 className="text-h3 font-bold uppercase mb-4">Create Workspace</h3>
            {error && <div className="text-red-400 mb-4">{error}</div>}
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <input
                type="text"
                placeholder="WORKSPACE NAME"
                value={newWorkspace.name}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                className="input-field"
                required
              />
              <textarea
                placeholder="DESCRIPTION (OPTIONAL)"
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                className="input-field h-24 resize-none"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  CREATE
                </button>
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

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-surface border border-surface-light p-6 w-full max-w-md">
            <h3 className="text-h3 font-bold uppercase mb-4">Join Workspace</h3>
            {error && <div className="text-red-400 mb-4">{error}</div>}
            <form onSubmit={handleJoinWorkspace} className="space-y-4">
              <input
                type="text"
                placeholder="WORKSPACE ID"
                value={joinCode.workspaceId}
                onChange={(e) => setJoinCode({ ...joinCode, workspaceId: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="INVITE CODE"
                value={joinCode.code}
                onChange={(e) => setJoinCode({ ...joinCode, code: e.target.value })}
                className="input-field"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  JOIN
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-6 py-3 border border-surface-light hover:bg-surface-light uppercase font-bold tracking-wider"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && inviteData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-surface border border-surface-light p-6 w-full max-w-md">
            <h3 className="text-h3 font-bold uppercase mb-4">Invite Members</h3>
            <p className="text-gray-400 mb-4">Share these details with others to join "{inviteData.name}"</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Workspace ID</label>
                <input
                  type="text"
                  value={inviteData.workspaceId}
                  readOnly
                  className="input-field bg-surface-light"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Invite Code</label>
                <input
                  type="text"
                  value={inviteData.inviteCode}
                  readOnly
                  className="input-field bg-surface-light"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(inviteData.inviteCode);
                }}
                className="btn-primary flex-1"
              >
                COPY CODE
              </button>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-3 border border-surface-light hover:bg-surface-light uppercase font-bold tracking-wider"
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
