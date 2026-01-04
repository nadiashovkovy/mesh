import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function CollaborationIndicator() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const collaborators = [
    { name: 'Emma', color: 'from-cyan-400 to-cyan-600' },
    { name: 'James', color: 'from-purple-400 to-purple-600' },
    { name: 'Sarah', color: 'from-pink-400 to-pink-600' },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur border border-slate-800 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {collaborators.map((collab, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 border-slate-900 bg-gradient-to-br ${collab.color}`}
                title={collab.name}
              ></div>
            ))}
          </div>
          <span className="text-xs text-slate-300">{collaborators.length} teammates</span>
        </div>
        {isExpanded ? (
          <ChevronDown size={16} className="text-slate-400" />
        ) : (
          <ChevronUp size={16} className="text-slate-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Editing Now</div>
          
          <div className="text-xs text-slate-400 mb-3">
            <span className="text-cyan-400 font-medium">Emma</span> is editing "Climate Data"
          </div>

          {/* Animated typing indicator */}
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}