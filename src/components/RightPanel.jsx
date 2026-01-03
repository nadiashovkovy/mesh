import React, { useState, useEffect } from 'react';
import { Eye, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RightPanel({ isOpen, selectedNode, onToggle }) {
  const [activeTab, setActiveTab] = useState('graph');

  // Switch to details tab when a node is selected
  useEffect(() => {
    if (selectedNode && isOpen) {
      setActiveTab('details');
    }
  }, [selectedNode, isOpen]);

  const concepts = [
    { label: 'Climate Change', connections: 12, color: 'from-cyan-400 to-cyan-600' },
    { label: 'CO2 Emissions', connections: 8, color: 'from-purple-400 to-purple-600' },
    { label: 'Greenhouse Effect', connections: 6, color: 'from-cyan-400 to-purple-500' },
    { label: 'Policy Implications', connections: 5, color: 'from-purple-400 to-purple-600' },
    { label: 'Future Projections', connections: 4, color: 'from-cyan-400 to-cyan-600' },
  ];

  const activities = [
    { user: 'Emma', action: 'linked', target: 'Climate Data', color: 'bg-cyan-400' },
    { user: 'James', action: 'added note to', target: 'Analysis', color: 'bg-purple-400' },
    { user: 'You', action: 'created connection', target: '', color: 'bg-cyan-400' },
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-2 rounded-lg hover:bg-slate-800 transition z-10"
        title={isOpen ? 'Collapse panel' : 'Expand panel'}
      >
        {isOpen ? <ChevronRight size={16} className="text-slate-400" /> : <ChevronLeft size={16} className="text-slate-400" />}
      </button>

      <div className={`${isOpen ? 'w-80' : 'w-0'} bg-slate-900/50 backdrop-blur border-l border-slate-800 flex flex-col overflow-hidden transition-all duration-300`}>
      {isOpen && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('graph')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'graph'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
          }`}
        >
          Graph
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition ${
            activeTab === 'details'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
          }`}
        >
          Details
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'graph' ? (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Connected Concepts</div>

            {concepts.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition cursor-pointer border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-200">{item.label}</span>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color}`}></div>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${(item.connections / 12) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{item.connections} connections</div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-700 mt-6">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Recent Activity</div>
              <div className="space-y-2 text-sm">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${activity.color} mt-1.5 flex-shrink-0`}></div>
                    <div>
                      <span className="text-slate-300">{activity.user}</span>
                      <span className="text-slate-500"> {activity.action} </span>
                      {activity.target && <span className="text-cyan-400">{activity.target}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Note Details</div>
            {selectedNode ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Selected Node</div>
                  <div className="text-sm font-medium text-cyan-400">Note #{selectedNode}</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Created</div>
                  <div className="text-sm text-slate-300">2 days ago</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Last Updated</div>
                  <div className="text-sm text-slate-300">1 hour ago by Emma</div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">Select a note to view details</div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-slate-800 p-4 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm">
          <Eye size={16} />
          View Full Graph
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm">
          <Lock size={16} />
          Permissions
        </button>
      </div>
        </>
      )}
      </div>
    </div>
  );
}