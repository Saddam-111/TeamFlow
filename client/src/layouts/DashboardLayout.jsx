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
      <div className="bg-surface border-b border-surface-light flex-shrink-0">
        <div className="flex items-center justify-between px-2 md:px-4 h-14">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              ☰
            </button>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 md:px-4 py-3 font-bold uppercase tracking-wider text-xs md:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-acid-yellow border-b-2 border-acid-yellow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="mr-1 md:mr-2">{tab.icon}</span>
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
            <div className="hidden lg:block w-52 md:w-64 flex-shrink-0 sticky top-0 h-full overflow-hidden">
              <WorkspaceSidebar />
            </div>
            <div className="hidden lg:block w-44 md:w-56 flex-shrink-0 sticky top-0 h-full overflow-hidden">
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
            <div className="hidden lg:block w-52 md:w-64 flex-shrink-0 sticky top-0 h-full overflow-hidden">
              <WorkspaceSidebar />
            </div>
            <TaskBoard />
          </div>
        )}

        {activeTab === 'docs' && (
          <>
            <div className="hidden lg:block w-52 md:w-64 flex-shrink-0 sticky top-0 h-full overflow-hidden">
              <WorkspaceSidebar />
            </div>
            <div className="hidden lg:block w-44 md:w-56 flex-shrink-0 sticky top-0 h-full overflow-hidden">
              <DocumentList />
            </div>
            <DocumentEditor />
          </>
        )}
      </div>

      {showMobileMenu && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-surface-light overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <WorkspaceSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
