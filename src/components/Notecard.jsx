import React from 'react';
import { Link2 } from 'lucide-react';

export default function NoteCard({ id, title, description, connections, color, isSelected, onClick }) {
  const borderColor = color === 'cyan' ? 'hover:border-cyan-400/50' : 'hover:border-purple-400/50';
  const shadowColor = color === 'cyan' ? 'hover:shadow-cyan-400/10' : 'hover:shadow-purple-400/10';
  const badgeColor = color === 'cyan' ? 'text-cyan-400 bg-cyan-400/10' : 'text-purple-400 bg-purple-400/10';
  const gradientColor = color === 'cyan' 
    ? 'from-cyan-400 to-cyan-600' 
    : 'from-purple-400 to-purple-600';

  return (
    <div
      onClick={onClick}
      className={`w-80 p-6 backdrop-blur border-2 rounded-xl transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'bg-slate-800/90 border-cyan-400 shadow-2xl shadow-cyan-400/30 ring-2 ring-cyan-400/20 scale-105' 
          : `bg-slate-900/80 border-slate-700 ${borderColor} ${shadowColor}`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`text-2xl font-bold ${badgeColor} px-3 py-1 rounded`}>#{id}</div>
        <Link2 size={16} className="text-slate-500" />
      </div>

      <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">{connections} connections</div>
        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradientColor}`}></div>
      </div>
    </div>
  );
}