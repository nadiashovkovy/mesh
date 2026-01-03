import React, { useState, useRef, useEffect } from 'react';
import { Plus, ZoomIn, ZoomOut } from 'lucide-react';
import NoteCard from './Notecard';
import CollaborationIndicator from './CollaborationIndicator';

export default function Canvas({ selectedNode, onSelectNode, notes }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const isPinching = useRef(false);
  const lastDistance = useRef(0);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

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
        <div 
          className="space-y-6 transition-transform origin-top-left"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {notes.map((note) => (
            <div key={note.id} className={`${note.offset} transition-transform`}>
              <NoteCard
                id={note.id}
                title={note.title}
                description={note.description}
                connections={note.connections}
                color={note.color}
                isSelected={selectedNode === note.id}
                onClick={() => onSelectNode(note.id)}
              />
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ 
            opacity: 0.3,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
          }}
        >
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path d="M 340 180 Q 450 200 600 220" stroke="url(#lineGrad1)" strokeWidth="2" fill="none" />
          <path d="M 600 220 Q 500 350 400 420" stroke="url(#lineGrad1)" strokeWidth="2" fill="none" />
        </svg>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 p-2">
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

      {/* Floating Action Button */}
      <button className="absolute bottom-8 right-8 p-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition hover:scale-110 z-10">
        <Plus size={24} className="text-white" />
      </button>

      {/* Collaboration Indicator */}
      <div className="absolute bottom-8 left-8 z-10">
        <CollaborationIndicator />
      </div>
    </div>
  );
}