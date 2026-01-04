import React, { useState } from 'react';
import { Home, BarChart3, Link2, Users, Settings, Menu, Plus, ChevronDown } from 'lucide-react';
import WorkspaceModal from './WorkspaceModal';

export default function Sidebar({ isOpen, onToggle, onWorkspaceChange }) {
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Research Lab', active: 3, isActive: true, color: 'from-cyan-400 to-purple-500' },
    { id: 2, name: 'Design Team', active: 5, isActive: false, color: 'from-pink-400 to-orange-500' },
    { id: 3, name: 'Personal', active: 2, isActive: false, color: 'from-green-400 to-blue-500' },
  ]);
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);

  const handleCreateWorkspace = (data) => {
    const newWorkspace = {
      id: workspaces.length + 1,
      name: data.name,
      active: 0,
      isActive: false,
      color: 'from-cyan-400 to-purple-500',
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  const handleJoinWorkspace = (data) => {
    // Handle joining via invite code or accepting invitation
    console.log('Joining workspace:', data);
    // In a real app, this would make an API call
  };

  const handleSwitchWorkspace = (workspace) => {
    setWorkspaces(workspaces.map(w => ({ ...w, isActive: w.id === workspace.id })));
    setCurrentWorkspace(workspace);
    setShowWorkspaceMenu(false);
    // Notify parent component
    if (onWorkspaceChange) {
      onWorkspaceChange(workspace);
    }
  };
  const navItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: BarChart3, label: 'Knowledge Map' },
    { icon: Link2, label: 'Recent Notes' },
    { icon: Users, label: 'Team' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-black border-r border-slate-800 flex flex-col transition-all duration-300 sticky top-0 h-screen`}>
      {/* Logo */}
      <div className={`h-16 px-4 border-b border-slate-800 flex items-center gap-3 ${!isOpen ? 'justify-center' : ''}`}>
        <img 
          src="/assets/MeshLogo.png" 
          alt="Mesh Logo" 
          className="w-5 h-5"
        />
        {isOpen && <span className="font-bold text-lg">Mesh</span>}
      </div>

      {/* Workspace */}
      {isOpen && (
        <div className="p-4 border-b border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Workspace</div>
          </div>
          
          {/* Current Workspace */}
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center gap-2 p-2 rounded bg-slate-800 hover:bg-slate-700 transition group"
          >
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{currentWorkspace.name}</div>
              <div className="text-xs text-slate-400">{currentWorkspace.active} active</div>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform ${showWorkspaceMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Workspace Dropdown */}
          {showWorkspaceMenu && (
            <div className="absolute left-4 right-4 top-full mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSwitchWorkspace(workspace)}
                    className={`w-full flex items-center gap-3 p-2 rounded transition ${
                      workspace.isActive 
                        ? 'bg-slate-800 text-cyan-400' 
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded bg-gradient-to-br ${workspace.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {workspace.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{workspace.name}</div>
                      <div className="text-xs text-slate-400">{workspace.active} active</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 p-2">
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    setShowWorkspaceModal(true);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded hover:bg-slate-800 transition text-slate-300 hover:text-cyan-400"
                >
                  <Plus size={16} />
                  <span className="text-sm">Add or Join Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-cyan-400"
            title={item.label}
          >
            <item.icon size={20} />
            {isOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* User */}
      {isOpen && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500"></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Nadia Shovkovy</div>
              <div className="text-xs text-slate-400 truncate">nadiashovkovy@research.ai</div>
            </div>
          </div>
        </div>
      )}
      {/* Workspace Modal */}
      <WorkspaceModal
        isOpen={showWorkspaceModal}
        onClose={() => setShowWorkspaceModal(false)}
        onCreateWorkspace={handleCreateWorkspace}
        onJoinWorkspace={handleJoinWorkspace}
      />    </div>
  );
}