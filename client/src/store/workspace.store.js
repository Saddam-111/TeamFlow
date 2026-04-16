import { create } from 'zustand';
import { useAuthStore } from './auth.store';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  channels: [],
  currentChannel: null,
  members: [],
  
  setWorkspaces: (workspaces) => set({ workspaces }),
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  
  setChannels: (channels) => set({ channels }),
  
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  
  setMembers: (members) => set({ members }),
  
  addChannel: (channel) => set((state) => ({ 
    channels: [...state.channels, channel] 
  })),

  removeChannel: (channelId) => set((state) => ({ 
    channels: state.channels.filter(c => c._id !== channelId) 
  })),

  addMember: (member) => set((state) => ({ 
    members: [...state.members, member] 
  })),

  removeMember: (memberId) => set((state) => ({ 
    members: state.members.filter(m => m.user._id !== memberId) 
  })),

  isCurrentUserAdmin: () => {
    try {
      const { currentWorkspace } = get();
      const authUser = useAuthStore.getState();
      
      console.log('isCurrentUserAdmin check:', { 
        hasUser: !!authUser?.user, 
        hasWorkspace: !!currentWorkspace,
        userId: authUser?.user?._id,
        workspaceOwner: currentWorkspace?.owner,
        workspaceCreatedBy: currentWorkspace?.createdBy
      });
      
      if (!authUser?.user || !currentWorkspace) {
        return false;
      }
      
      const currentUserId = authUser.user._id;
      
      // Check if user is workspace owner or creator
      if (currentWorkspace.owner === currentUserId || currentWorkspace.createdBy === currentUserId) {
        console.log('isCurrentUserAdmin: TRUE - User is owner/creator');
        return true;
      }
      
      console.log('isCurrentUserAdmin: FALSE');
      return false;
    } catch (error) {
      console.error('isCurrentUserAdmin error:', error);
      return false;
    }
  }
}));
