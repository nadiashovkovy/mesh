import React, { useState, useRef, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

export default function NoteCard({ id, title, description, connections, color, isSelected, onClick, position, onPositionChange, selectedNodes, allNotePositions, onGroupPositionChange, zoom = 1, pan = { x: 0, y: 0 } }) {
  const [isLocked, setIsLocked] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const groupDragStartPositions = useRef({});
  const cardRef = useRef(null);

  const borderColor = color === 'cyan' ? 'hover:border-cyan-400/50' : 'hover:border-purple-400/50';
  const shadowColor = color === 'cyan' ? 'hover:shadow-cyan-400/10' : 'hover:shadow-purple-400/10';
  const badgeColor = color === 'cyan' ? 'text-cyan-400 bg-cyan-400/10' : 'text-purple-400 bg-purple-400/10';
  const gradientColor = color === 'cyan' 
    ? 'from-cyan-400 to-cyan-600' 
    : 'from-purple-400 to-purple-600';

  const handleMouseDown = (e) => {
    if (isLocked || e.target.closest('button')) return;
    isDraggingRef.current = true;
    
    // Store the offset from mouse to card position in canvas space
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: position?.x || 0,
      initialY: position?.y || 0
    };
    
    // If this card is part of a multi-selection, store starting positions of all selected cards
    if (selectedNodes && selectedNodes.includes(id) && selectedNodes.length > 1) {
      groupDragStartPositions.current = {};
      selectedNodes.forEach(nodeId => {
        const pos = allNotePositions[nodeId];
        if (pos) {
          groupDragStartPositions.current[nodeId] = { ...pos };
        }
      });
    }
    
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || isLocked) return;
      
      // Calculate mouse movement delta
      const deltaX = (e.clientX - dragStartRef.current.x) / zoom;
      const deltaY = (e.clientY - dragStartRef.current.y) / zoom;
      
      // Check if dragging multiple selected cards
      if (selectedNodes && selectedNodes.includes(id) && selectedNodes.length > 1 && onGroupPositionChange) {
        // Move all selected cards by the same delta
        const newPositions = { ...allNotePositions };
        selectedNodes.forEach(nodeId => {
          const startPos = groupDragStartPositions.current[nodeId];
          if (startPos) {
            newPositions[nodeId] = {
              x: startPos.x + deltaX,
              y: startPos.y + deltaY
            };
          }
        });
        onGroupPositionChange(newPositions);
      } else {
        // Single card drag
        const newX = dragStartRef.current.initialX + deltaX;
        const newY = dragStartRef.current.initialY + deltaY;
        onPositionChange?.(id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      groupDragStartPositions.current = {};
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isLocked, onPositionChange, selectedNodes, position, allNotePositions, onGroupPositionChange, zoom]);

  const toggleLock = (e) => {
    e.stopPropagation();
    setIsLocked(!isLocked);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      className={`notecard w-80 p-6 backdrop-blur border-2 rounded-xl select-none ${
        isLocked ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${
        isSelected 
          ? 'bg-slate-800/90 border-cyan-400 shadow-2xl shadow-cyan-400/30 ring-2 ring-cyan-400/20 scale-105 transition-all duration-300' 
          : `bg-slate-900/80 border-slate-700 ${borderColor} ${shadowColor} transition-all duration-300`
      }`}
      style={position ? {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.3s'
      } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`text-2xl font-bold ${badgeColor} px-3 py-1 rounded`}>#{id}</div>
        <button
          onClick={toggleLock}
          className="p-1 hover:bg-slate-700/50 rounded transition"
          title={isLocked ? 'Unlock position' : 'Lock position'}
        >
          {isLocked ? (
            <Lock size={16} className="text-slate-400" />
          ) : (
            <Unlock size={16} className="text-slate-500" />
          )}
        </button>
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