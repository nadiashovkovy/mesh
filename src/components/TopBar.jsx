import React from 'react';
import { Plus, Share2, Search, Menu, Filter } from 'lucide-react';

export default function TopBar({ onToggleSidebar, onSearch, searchQuery }) {
  const collaborators = [
    { color: '#F1B9E8', name: 'Emma' },
    { color: '#89EFEF', name: 'James' },
    { color: '#FF7D45', name: 'Sarah' },
  ];

  return (
    <div className="h-16 bg-gradient-to-r from-slate-900 via-black to-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 gap-2">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="text-slate-400 hover:text-cyan-400 transition"
          title="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search titles, content, team..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:border-cyan-400 outline-none transition"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button
            className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-cyan-400 transition"
            title="Filter"
          >
            <Filter size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-medium text-sm hover:scale-105">
          <Plus size={18} />
          <span className="hidden md:inline">New Node</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition text-sm">
          <Share2 size={18} />
          <span className="hidden md:inline">Share</span>
        </button>

        {/* Collaborators */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
          <div className="flex">
            {collaborators.map((collab, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-slate-900 -ml-2 first:ml-0"
                style={{ backgroundColor: collab.color }}
                title={collab.name}
              ></div>
            ))}
          </div>
          <span className="text-xs text-slate-400 ml-1">+2</span>
        </div>
      </div>
    </div>
  );
}