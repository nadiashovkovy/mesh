import React, { useState, useRef, useEffect } from 'react';
import { Plus, ZoomIn, ZoomOut, Maximize, Minimize, Sparkles, GitBranch, Palette, Share2, MoreVertical } from 'lucide-react';
import NoteCard from './Notecard';
import CollaborationIndicator from './CollaborationIndicator';
import RightPanel from './RightPanel';

export default function Canvas({ selectedNode, onSelectNode, notes, isFullscreen, onFullscreenChange, rightPanelOpen, onRightPanelToggle }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [notePositions, setNotePositions] = useState({});
  const canvasRef = useRef(null);
  const isPinching = useRef(false);
  const lastDistance = useRef(0);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  // Initialize random positions for notecards
  useEffect(() => {
    const initialPositions = {};
    notes.forEach((note, index) => {
      // Create scattered positions in a grid-like pattern with randomness
      const col = index % 3;
      const row = Math.floor(index / 3);
      initialPositions[note.id] = {
        x: col * 400 + Math.random() * 100,
        y: row * 300 + Math.random() * 100
      };
    });
    setNotePositions(initialPositions);
  }, [notes.length]);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + Plus/Equals for zoom in
      if ((e.metaKey || e.ctrlKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
      }
      // Cmd/Ctrl + Minus for zoom out
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
      }
      // Cmd/Ctrl + 0 for reset zoom
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pinch-to-zoom for touch devices
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        isPinching.current = true;
        const distance = getDistance(e.touches[0], e.touches[1]);
        lastDistance.current = distance;
      }
    };

    const handleTouchMove = (e) => {
      if (isPinching.current && e.touches.length === 2) {
        e.preventDefault();
        const distance = getDistance(e.touches[0], e.touches[1]);
        const delta = distance - lastDistance.current;
        const zoomDelta = delta * 0.01;
        
        setZoom((prev) => {
          const newZoom = prev + zoomDelta;
          return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
        });
        
        lastDistance.current = distance;
      }
    };

    const handleTouchEnd = () => {
      isPinching.current = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setZoom((prev) => {
          const newZoom = prev + delta;
          return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
        });
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  // Listen for fullscreen changes (including ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      onFullscreenChange(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onFullscreenChange]);

  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      onFullscreenChange(true);
    } else {
      document.exitFullscreen();
      onFullscreenChange(false);
    }
  };

  const actionMenuItems = [
    { icon: Plus, label: 'New Note', onClick: () => console.log('New Note') },
    { icon: isFullscreen ? Minimize : Maximize, label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen', onClick: toggleFullscreen },
    { icon: GitBranch, label: 'Simplify', onClick: () => console.log('Simplify') },
    { icon: Sparkles, label: 'AI Overview', onClick: () => console.log('AI Overview') },
    { icon: Palette, label: 'Change Theme', onClick: () => console.log('Change Theme') }
  ];

  const handlePositionChange = (noteId, position) => {
    setNotePositions(prev => ({
      ...prev,
      [noteId]: position
    }));
  };

  // Calculate connection lines between notecards
  const getConnectionLines = () => {
    const lines = [];
    const cardWidth = 320; // w-80 = 320px
    const cardHeight = 180; // approximate height
    
    // Create connections between sequential notes
    for (let i = 0; i < notes.length - 1; i++) {
      const fromNote = notes[i];
      const toNote = notes[i + 1];
      const fromPos = notePositions[fromNote.id];
      const toPos = notePositions[toNote.id];
      
      if (fromPos && toPos) {
        // Calculate center points of each card
        const x1 = fromPos.x + cardWidth / 2;
        const y1 = fromPos.y + cardHeight / 2;
        const x2 = toPos.x + cardWidth / 2;
        const y2 = toPos.y + cardHeight / 2;
        
        // Calculate control point for curve (midpoint with offset)
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const offsetY = Math.abs(x2 - x1) * 0.2;
        
        lines.push({
          id: `${fromNote.id}-${toNote.id}`,
          d: `M ${x1} ${y1} Q ${midX} ${midY - offsetY} ${x2} ${y2}`,
          color: fromNote.color
        });
      }
    }
    
    return lines;
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-gradient-to-br from-black via-slate-950 to-black overflow-hidden relative"
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      ></div>

      {/* Canvas Content */}
      <div className="relative p-8 h-full overflow-auto scrollbar-hide">
        {/* Connection Lines - Behind notecards */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ 
            opacity: 0.5,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
          }}
        >
          <defs>
            <linearGradient id="lineGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="lineGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {getConnectionLines().map((line) => (
            <path
              key={line.id}
              d={line.d}
              stroke={line.color === 'cyan' ? 'url(#lineGradCyan)' : 'url(#lineGradPurple)'}
              strokeWidth="2"
              fill="none"
            />
          ))}
        </svg>

        <div 
          className="relative min-h-[800px]"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
          }}
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              description={note.description}
              connections={note.connections}
              color={note.color}
              isSelected={selectedNode === note.id}
              onClick={() => onSelectNode(note.id)}
              position={notePositions[note.id]}
              onPositionChange={handlePositionChange}
            />
          ))}
        </div>

        {/* Zoom Controls */}
        <div className={`absolute flex flex-col gap-2 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 p-2 transition-all duration-300 ${
          isFullscreen ? 'top-8' : 'top-4'
        } ${
          isFullscreen && rightPanelOpen ? 'right-96' : 'right-4'
        }`}>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="p-2 hover:bg-slate-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom In (Cmd/Ctrl +)"
          >
            <ZoomIn size={20} className="text-slate-300" />
          </button>
          <div className="text-xs text-center text-slate-400 py-1">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="p-2 hover:bg-slate-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom Out (Cmd/Ctrl -)"
          >
            <ZoomOut size={20} className="text-slate-300" />
          </button>
          <button
            onClick={handleResetZoom}
            className="text-xs text-slate-400 hover:text-cyan-400 py-1 transition"
            title="Reset Zoom (Cmd/Ctrl 0)"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Floating Action Menu */}
      <div 
        className={`absolute bottom-8 z-[60] transition-all duration-300 ${
          isFullscreen && rightPanelOpen ? 'right-96' : 'right-8'
        }`}
        onMouseEnter={() => setShowActionMenu(true)}
        onMouseLeave={() => setShowActionMenu(false)}
      >
        {showActionMenu ? (
          <div className="flex flex-col gap-2 bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-800 p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {actionMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition group whitespace-nowrap"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <item.icon size={18} className="text-slate-400 group-hover:text-cyan-400 transition" />
                <span className="text-sm text-slate-300 group-hover:text-white transition">{item.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <button className="p-4 bg-purple-500 rounded-full shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition hover:scale-110">
            <MoreVertical size={24} className="text-white" />
          </button>
        )}
      </div>

      {/* Collaboration Indicator */}
      <div className="absolute bottom-8 left-8 z-10">
        <CollaborationIndicator />
      </div>

      {/* Right Panel (only in fullscreen) */}
      {isFullscreen && (
        <div className="absolute top-8 right-8 bottom-8 z-50">
          <RightPanel 
            isOpen={rightPanelOpen} 
            selectedNode={selectedNode} 
            selectedNote={notes.find(note => note.id === selectedNode)}
            onToggle={onRightPanelToggle}
            isFullscreen={true}
          />
        </div>
      )}
    </div>
  );
}