import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';

export default function Group({ id, label, x, y, width, height, color, nodeIds, notes, notePositions, onUpdate, onDelete, zoom, isLocked }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(label);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: x, initialY: y });
  const resizeStartRef = useRef({ x: 0, y: 0, initialWidth: width, initialHeight: height });
  const groupRef = useRef(null);
  const inputRef = useRef(null);

  const gradientColor = color === 'cyan' 
    ? 'from-cyan-400/10 to-cyan-600/10' 
    : 'from-purple-400/10 to-purple-600/10';
  const borderColor = color === 'cyan' ? 'border-cyan-400/30' : 'border-purple-400/30';
  const textColor = color === 'cyan' ? 'text-cyan-400' : 'text-purple-400';

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-resize group to fit all contained nodes
  useEffect(() => {
    if (nodeIds.length === 0) return;

    const padding = 100;
    const cardWidth = 320;
    const cardHeight = 150;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodeIds.forEach(nodeId => {
      const pos = notePositions[nodeId];
      if (pos) {
        minX = Math.min(minX, pos.x);
        minY = Math.min(minY, pos.y);
        maxX = Math.max(maxX, pos.x + cardWidth);
        maxY = Math.max(maxY, pos.y + cardHeight);
      }
    });

    if (minX !== Infinity) {
      const newX = minX - padding;
      const newY = minY - padding;
      const newWidth = maxX - minX + padding * 2;
      const newHeight = maxY - minY + padding * 2;

      // Only update if there's a significant change to avoid infinite loops
      const hasChanged = 
        Math.abs(newX - x) > 1 || 
        Math.abs(newY - y) > 1 || 
        Math.abs(newWidth - width) > 1 || 
        Math.abs(newHeight - height) > 1;

      if (hasChanged) {
        onUpdate(id, { x: newX, y: newY, width: newWidth, height: newHeight });
      }
    }
  }, [nodeIds, notePositions, id, x, y, width, height, onUpdate]);

  const handleMouseDown = (e) => {
    if (isLocked || e.target.closest('button') || e.target.closest('input')) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: x,
      initialY: y
    };
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleContextMenu = (e) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleResizeMouseDown = (e) => {
    if (isLocked) return;
    
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialWidth: width,
      initialHeight: height
    };
    
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStartRef.current.x) / zoom;
        const deltaY = (e.clientY - dragStartRef.current.y) / zoom;
        
        onUpdate(id, {
          x: dragStartRef.current.initialX + deltaX,
          y: dragStartRef.current.initialY + deltaY
        });
      } else if (isResizing) {
        const deltaX = (e.clientX - resizeStartRef.current.x) / zoom;
        const deltaY = (e.clientY - resizeStartRef.current.y) / zoom;
        
        const newWidth = Math.max(200, resizeStartRef.current.initialWidth + deltaX);
        const newHeight = Math.max(150, resizeStartRef.current.initialHeight + deltaY);
        
        onUpdate(id, {
          width: newWidth,
          height: newHeight
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, id, onUpdate, zoom]);

  const handleLabelSubmit = () => {
    setIsEditing(false);
    if (localLabel.trim() !== label) {
      onUpdate(id, { label: localLabel.trim() || 'New Group' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setLocalLabel(label);
      setIsEditing(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && !e.target.closest(`[data-group-id="${id}"]`)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu, id]);

  return (
    <g style={{ cursor: isDragging ? 'grabbing' : 'grab', pointerEvents: 'auto' }} data-group-id={id}>
      {/* Group rectangle */}
      <rect
        ref={groupRef}
        x={x}
        y={y}
        width={width}
        height={height}
        rx="40"
        ry="40"
        className={`${borderColor} transition-all duration-200`}
        style={{
          fill: `url(#groupGrad${color}${id})`,
          stroke: color === 'cyan' ? '#06B6D4' : '#A855F7',
          strokeWidth: 2,
          strokeDasharray: '8 4',
          opacity: 0.8,
          cursor: isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'all'
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`groupGrad${color}${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'cyan' ? '#06B6D4' : '#A855F7'} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color === 'cyan' ? '#06B6D4' : '#A855F7'} stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* Label */}
      <foreignObject
        x={x - 60}
        y={y - 40}
        width="200"
        height="40"
        style={{ pointerEvents: isEditing ? 'auto' : 'none' }}
      >
        <div className="flex items-center justify-center">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
              onBlur={handleLabelSubmit}
              onKeyDown={handleKeyDown}
              className={`px-3 py-1 bg-slate-900/90 border ${borderColor} rounded-lg text-sm ${textColor} outline-none text-center`}
              style={{ pointerEvents: 'auto' }}
            />
          ) : (
            <div 
              className={`px-3 py-1 bg-slate-900/80 backdrop-blur-sm border ${borderColor} rounded-lg text-sm font-medium ${textColor} cursor-pointer`}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              style={{ pointerEvents: 'auto' }}
            >
              {label}
            </div>
          )}
        </div>
      </foreignObject>

      

      {/* Menu buttons */}
      {showMenu && !isLocked && (
        <foreignObject
          x={x + width / 2 - 40}
          y={y + height / 2 + 100}
          width="80"
          height="40"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex gap-1 bg-slate-900/90 backdrop-blur-sm rounded-lg p-1 border border-slate-700" data-group-id={id}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="p-1.5 hover:bg-slate-800 rounded transition"
              title="Edit label"
            >
              <Edit2 size={14} className="text-slate-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1.5 hover:bg-red-900/50 rounded transition"
              title="Delete group"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </foreignObject>
      )}

      {/* Resize handle */}
      {!isLocked && (
        <circle
          cx={x + width}
          cy={y + height}
          r="8"
          className={`${borderColor} cursor-se-resize`}
          style={{
            fill: color === 'cyan' ? '#06B6D4' : '#A855F7',
            stroke: '#1e293b',
            strokeWidth: 2,
            opacity: 0.5
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </g>
  );
}
