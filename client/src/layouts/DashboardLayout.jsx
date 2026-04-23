import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store/workspace.store.js';
import { WorkspaceSidebar } from '../features/workspace/WorkspaceSidebar';
import { ChannelList } from '../features/chat/ChannelList';
import { MessageList } from '../features/chat/MessageList';
import { MessageInput } from '../features/chat/MessageInput';
import { TaskBoard } from '../features/tasks/TaskBoard';
import { DocumentList } from '../features/docs/DocumentList';
import { DocumentEditor } from '../features/docs/DocumentEditor';
import { NotificationPanel } from '../features/notifications/NotificationPanel';

const TABS = [
  { id: 'chat', label: 'CHAT', icon: '💬' },
  { id: 'tasks', label: 'TASKS', icon: '📋' },
  { id: 'docs', label: 'DOCS', icon: '📄' }
];

export function DashboardLayout() {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState('chat');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showChannelList, setShowChannelList] = useState(false);
  const [showDocList, setShowDocList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prevWorkspace, setPrevWorkspace] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (prevWorkspace && currentWorkspace && prevWorkspace._id !== currentWorkspace._id) {
      setShowMobileMenu(false);
    }
    setPrevWorkspace(currentWorkspace);
  }, [currentWorkspace, prevWorkspace]);

  const closeAllMenus = () => {
    setShowMobileMenu(false);
    setShowChannelList(false);
    setShowDocList(false);
  };

  const renderMobileDrawer = (isOpen, onClose, title, children) => {
    if (!isMobile || !isOpen) return null;
    return (
      <div 
        className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-obsidian border-r border-white/[0.06] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="font-bold uppercase text-sm text-lime-accent">{title}</span>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="glass border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between px-2 md:px-4 h-12 sm:h-14">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[calc(100vw-200px)]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    closeAllMenus();
                  }}
                  className={`px-3 sm:px-4 py-2 sm:py-3 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-lime-accent bg-lime-accent/10 border-b-2 border-lime-accent'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <NotificationPanel />
        </div>
        
        {isMobile && activeTab === 'chat' && currentWorkspace && (
          <div className="flex items-center gap-2 px-2 pb-2 border-t border-white/[0.06]">
            <button
              onClick={() => setShowChannelList(true)}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white bg-white/[0.06] px-3 py-1.5 rounded"
            >
              <span>#</span>
              <span>Channels</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {currentWorkspace && (
              <span className="text-xs text-lime-accent truncate">{currentWorkspace.name}</span>
            )}
          </div>
        )}
        
        {isMobile && activeTab === 'tasks' && currentWorkspace && (
          <div className="flex items-center gap-2 px-2 pb-2 border-t border-white/[0.06]">
            <span className="text-xs text-lime-accent">{currentWorkspace.name}</span>
          </div>
        )}
        
        {isMobile && activeTab === 'docs' && currentWorkspace && (
          <div className="flex items-center gap-2 px-2 pb-2 border-t border-white/[0.06]">
            <button
              onClick={() => setShowDocList(true)}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white bg-white/[0.06] px-3 py-1.5 rounded"
            >
              <span>📄</span>
              <span>Docs</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {currentWorkspace && (
              <span className="text-xs text-lime-accent truncate">{currentWorkspace.name}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'chat' && (
          <>
            <div className="hidden lg:flex w-48 md:w-56 lg:w-52 flex-shrink-0 h-full overflow-hidden">
              <WorkspaceSidebar />
            </div>
            <div className="hidden lg:flex w-40 md:w-48 flex-shrink-0 h-full overflow-hidden">
              <ChannelList />
            </div>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <MessageList />
              <MessageInput />
            </div>
          </>
        )}

        {activeTab === 'tasks' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="hidden lg:flex w-48 md:w-56 lg:w-52 flex-shrink-0 h-full overflow-hidden">
              <WorkspaceSidebar />
            </div>
            <TaskBoard />
          </div>
        )}

        {activeTab === 'docs' && (
          <>
            <div className="hidden lg:flex w-48 md:w-56 lg:w-52 flex-shrink-0 h-full overflow-hidden">
              <WorkspaceSidebar />
            </div>
            <div className="hidden lg:flex w-40 md:w-48 flex-shrink-0 h-full overflow-hidden">
              <DocumentList />
            </div>
            <DocumentEditor />
          </>
        )}
      </div>

      {showMobileMenu && isMobile && renderMobileDrawer(showMobileMenu, () => setShowMobileMenu(false), 'Workspace', <WorkspaceSidebar />)}
      
      {showChannelList && isMobile && renderMobileDrawer(showChannelList, () => setShowChannelList(false), 'Channels', <ChannelList />)}
      
      {showDocList && isMobile && renderMobileDrawer(showDocList, () => setShowDocList(false), 'Documents', <DocumentList />)}
    </div>
  );
}