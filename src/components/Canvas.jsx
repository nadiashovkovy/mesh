import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Plus, ZoomIn, ZoomOut, Maximize, Minimize, Sparkles, GitBranch, Palette, Share2, MoreVertical, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import NoteCard from './Notecard';
import CollaborationIndicator from './CollaborationIndicator';
import RightPanel from './RightPanel';

const Canvas = forwardRef(({ selectedNodes, onSelectNode, notes, isFullscreen, onFullscreenChange, rightPanelOpen, onRightPanelToggle, onSearch, searchQuery, searchResultsCount = 0, currentSearchIndex = 0, onSearchNavigate, onUpdateNote, onAddConnection, notePositions: externalPositions, onPositionUpdate, onPositionChangeComplete, onCopyNode }, ref) => {
  const [zoom, setZoom] = useState(.5);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [notePositions, setNotePositions] = useState(externalPositions || {});
  const [searchBarCollapsed, setSearchBarCollapsed] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [isSimplified, setIsSimplified] = useState(false);
  const fullscreenSearchInputRef = useRef(null);
  const canvasRef = useRef(null);
  const isPinching = useRef(false);
  const lastDistance = useRef(0);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  const MIN_ZOOM = .1;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  // Sync with external positions when they change (from undo/redo)
  useEffect(() => {
    if (externalPositions && Object.keys(externalPositions).length > 0) {
      setNotePositions(externalPositions);
    }
  }, [externalPositions]);

  // Expose panToNote method to parent
  useImperativeHandle(ref, () => ({
    panToNote: (noteId) => {
      const position = notePositions[noteId];
      if (!position) return;

      // Calculate center of canvas
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const centerX = canvasRect.width / 2;
      const centerY = canvasRect.height / 2;

      // Calculate pan needed to center the notecard
      const cardWidth = 320;
      const cardHeight = 180;
      const targetX = -(position.x + cardWidth / 2) * zoom + centerX;
      const targetY = -(position.y + cardHeight / 2) * zoom + centerY;

      // Animate pan
      const startPan = { ...pan };
      const duration = 800;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        setPan({
          x: startPan.x + (targetX - startPan.x) * easeProgress,
          y: startPan.y + (targetY - startPan.y) * easeProgress
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }));

  // Initialize positions for new notecards only
  useEffect(() => {
    setNotePositions(prev => {
      const newPositions = { ...prev };
      const cardWidth = 320;
      const cardHeight = 200;
      const minDistance = 400; // Minimum distance between nodes
      
      notes.forEach((note) => {
        // Only add position if this note doesn't have one yet
        if (!newPositions[note.id]) {
          // Find a position that doesn't overlap with existing nodes
          let attempts = 0;
          let validPosition = null;
          
          while (!validPosition && attempts < 50) {
            // Start with a grid-like pattern and add randomness
            const existingCount = Object.keys(newPositions).length;
            const col = existingCount % 3;
            const row = Math.floor(existingCount / 3);
            
            const candidateX = col * 450 + Math.random() * 150;
            const candidateY = row * 350 + Math.random() * 150;
            
            // Check if this position is far enough from all existing nodes
            const isFarEnough = Object.values(newPositions).every(pos => {
              const dx = pos.x - candidateX;
              const dy = pos.y - candidateY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance >= minDistance;
            });
            
            if (isFarEnough || Object.keys(newPositions).length === 0) {
              validPosition = { x: candidateX, y: candidateY };
            }
            
            attempts++;
          }
          
          // If we couldn't find a valid position after 50 attempts, place it far to the right
          if (!validPosition) {
            const existingCount = Object.keys(newPositions).length;
            validPosition = {
              x: existingCount * 450,
              y: Math.random() * 200
            };
          }
          
          newPositions[note.id] = validPosition;
        }
      });
      
      return newPositions;
    });
  }, [notes]);

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
        
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const delta = -e.deltaY * 0.009;
        
        setZoom((prevZoom) => {
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
          
          // Calculate the point in canvas space before zoom
          const canvasX = (mouseX - pan.x * prevZoom) / prevZoom;
          const canvasY = (mouseY - pan.y * prevZoom) / prevZoom;
          
          // Adjust pan so the same canvas point stays under the mouse
          setPan({
            x: (mouseX - canvasX * newZoom) / newZoom,
            y: (mouseY - canvasY * newZoom) / newZoom
          });
          
          return newZoom;
        });
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [pan]);

  // Mouse drag to pan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      // Allow dragging on left click when clicking on canvas background or content area
      // Exclude interactive elements like buttons, inputs, notecards
      const isInteractiveElement = e.target.closest('button, input, textarea, a, [draggable="true"], .notecard');
      
      if (e.button === 0 && !isInteractiveElement) {
        e.preventDefault();
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        
        setPan((prev) => ({
          x: prev.x + deltaX / zoom,
          y: prev.y + deltaY / zoom
        }));
        
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = '';
      }
    };

    const handleMouseLeave = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = '';
      }
    };
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [zoom]);

  // Listen for fullscreen changes (including ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      onFullscreenChange(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onFullscreenChange]);

  // Two-finger trackpad scroll for panning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleScroll = (e) => {
      // Only pan if NOT using Ctrl/Cmd (which is for zooming)
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        
        // Use deltaX and deltaY for panning
        setPan((prev) => ({
          x: prev.x - e.deltaX / zoom,
          y: prev.y - e.deltaY / zoom
        }));
      }
    };

    canvas.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleScroll);
    };
  }, [zoom]);

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
    { icon: Plus, label: 'New Node', onClick: () => console.log('New Node') },
    { icon: isFullscreen ? Minimize : Maximize, label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen', onClick: toggleFullscreen },
    { icon: GitBranch, label: isSimplified ? 'Show Details' : 'Simplify', onClick: () => setIsSimplified(!isSimplified) },
    { icon: Sparkles, label: 'AI Overview', onClick: () => console.log('AI Overview') },
    { icon: Palette, label: 'Change Theme', onClick: () => console.log('Change Theme') }
  ];

  const handlePositionChange = (noteId, position) => {
    const newPositions = {
      ...notePositions,
      [noteId]: position
    };
    setNotePositions(newPositions);
    onPositionUpdate?.(newPositions);
  };

  const handleGroupPositionChange = (newPositions) => {
    setNotePositions(newPositions);
    onPositionUpdate?.(newPositions);
  };
  const getConnectionLines = () => {
    const lines = [];
    const cardWidth = 320; // w-80 = 320px
    const cardHeight = 180; // approximate height
    
    // Create lines based on connectedTo arrays
    notes.forEach((fromNote) => {
      const fromPos = notePositions[fromNote.id];
      const connectedTo = fromNote.connectedTo || [];
      
      connectedTo.forEach((toId) => {
        const toNote = notes.find(n => n.id === toId);
        const toPos = notePositions[toId];
        
        if (fromPos && toPos && toNote) {
          // Calculate center points of each card
          const x1 = fromPos.x + cardWidth / 2;
          const y1 = fromPos.y + cardHeight / 2;
          const x2 = toPos.x + cardWidth / 2;
          const y2 = toPos.y + cardHeight / 2;
          
          lines.push({
            id: `${fromNote.id}-${toId}`,
            d: `M ${x1} ${y1} L ${x2} ${y2}`,
            color: fromNote.color
          });
        }
      });
    });
    
    return lines;
  };

  const handleStartConnection = (nodeId) => {
    setConnectingFrom(nodeId);
  };

  const handleEndConnection = (toNodeId) => {
    if (connectingFrom && connectingFrom !== toNodeId) {
      onAddConnection?.(connectingFrom, toNodeId);
    }
    setConnectingFrom(null);
  };

  const handleCancelConnection = () => {
    setConnectingFrom(null);
  };

  const handleNoteClick = (noteId, isShiftKey) => {
    // If we're in connection mode, complete the connection
    if (connectingFrom) {
      if (connectingFrom !== noteId) {
        handleEndConnection(noteId);
      }
      return;
    }
    
    // Otherwise, normal selection behavior
    onSelectNode(noteId, isShiftKey);
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
            'linear-gradient(#7e7e7eff 1px, transparent 1px), linear-gradient(90deg, #7e7e7eff 1px, transparent 1px)',
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          backgroundPosition: `${pan.x * zoom}px ${pan.y * zoom}px`,
        }}
      ></div>

      {/* Floating Search Bar (only in fullscreen) */}
      {isFullscreen && (
        <div className="absolute top-8 left-8 z-[60] transition-all duration-300">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Collapse/Expand Button */}
            <button
              onClick={() => setSearchBarCollapsed(!searchBarCollapsed)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-2">
                <Search size={16} className="text-slate-400" />
                <span className="text-sm text-slate-400">Search</span>
              </div>
              {searchBarCollapsed ? (
                <ChevronDown size={16} className="text-slate-400" />
              ) : (
                <ChevronUp size={16} className="text-slate-400" />
              )}
            </button>
            
            {/* Search Input Section */}
            {!searchBarCollapsed && (
              <div className="flex items-center gap-2 px-4 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                  <input
                    ref={fullscreenSearchInputRef}
                    type="text"
                    placeholder="Search titles, content..."
                    className="w-80 pl-9 pr-20 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:border-cyan-400 outline-none transition"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (searchResultsCount > 0) {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          onSearchNavigate?.('next');
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          onSearchNavigate?.('prev');
                        }
                      }
                    }}
                  />
                  {searchResultsCount > 0 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {currentSearchIndex + 1} of {searchResultsCount}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => onSearchNavigate?.('prev')}
                          className="p-0.5 hover:bg-slate-700 rounded transition"
                          title="Previous result (↑)"
                        >
                          <ChevronUp size={12} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => onSearchNavigate?.('next')}
                          className="p-0.5 hover:bg-slate-700 rounded transition"
                          title="Next result (↓)"
                        >
                          <ChevronDown size={12} className="text-slate-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-cyan-400 transition"
                  title="Filter"
                >
                  <Filter size={16} className="text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Canvas Content */}
      <div className="relative h-full overflow-hidden">
        {/* Connection Lines - Behind notecards */}
        <svg 
          className="absolute pointer-events-none" 
          style={{ 
            opacity: 0.5,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
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
          className="absolute inset-0"
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
              connectedTo={note.connectedTo || []}
              allNotes={notes}
              color={note.color}
              isSelected={selectedNodes && selectedNodes.includes(note.id)}
              onClick={(e) => handleNoteClick(note.id, e.shiftKey)}
              position={notePositions[note.id]}
              onPositionChange={handlePositionChange}
              selectedNodes={selectedNodes}
              allNotePositions={notePositions}
              onGroupPositionChange={handleGroupPositionChange}
              onPositionChangeComplete={onPositionChangeComplete}
              zoom={zoom}
              pan={pan}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
              onCancelConnection={handleCancelConnection}
              isConnecting={connectingFrom === note.id}
              onCopy={onCopyNode}
              isSimplified={isSimplified}
            />
          ))}
        </div>
      </div>

      {/* Zoom Controls - Fixed position outside scrollable area */}
      <div className={`absolute flex flex-col gap-2 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-800 p-2 z-[60] transition-all duration-300 ${
        isFullscreen && rightPanelOpen ? 'right-96' : 'right-8'
      }`} style={{ bottom: '120px' }}>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="p-2 hover:bg-slate-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In (Cmd/Ctrl +)"
        >
          <ZoomIn size={20} className="text-slate-300" />
        </button>
        {/* uncomment div below to show zoom percentage */}
        {/* <div className="text-xs text-center text-slate-400 py-1">
          {Math.round(zoom * 100)}%
        </div> */}
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
            selectedNode={selectedNodes && selectedNodes.length === 1 ? selectedNodes[0] : null} 
            selectedNote={selectedNodes && selectedNodes.length === 1 ? notes.find(note => note.id === selectedNodes[0]) : null}
            onToggle={onRightPanelToggle}
            isFullscreen={true}
            onUpdateNote={onUpdateNote}
          />
        </div>
      )}
    </div>
  );
});

export default Canvas;