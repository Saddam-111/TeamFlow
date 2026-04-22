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
  const { currentWorkspace } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState('chat');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
                  onClick={() => setActiveTab(tab.id)}
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

      {showMobileMenu && isMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-obsidian border-r border-white/[0.06] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <WorkspaceSidebar />
          </div>
        </div>
      )}
    </div>
  );
}