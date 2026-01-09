import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Canvas from '../components/Canvas';
import RightPanel from '../components/RightPanel';
import WorkspaceModal from '../components/WorkspaceModal';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 1, name: 'Research Lab', active: 3 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [notePositions, setNotePositions] = useState({});
  const [copiedNodes, setCopiedNodes] = useState([]);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceGroups, setWorkspaceGroups] = useState({});
  const canvasRef = useRef(null);

  // Workspace-specific notes - now using state
  const [workspaceNotes, setWorkspaceNotes] = useState({
    1: [ // Research Lab
      {
        id: 1,
        title: 'Research Question: Climate Impact',
        description: 'How do carbon emissions affect global temperatures? Initial hypothesis testing...',
        connectedTo: [2],
        color: 'cyan',
        offset: 'translate-x-0 translate-y-0',
      },
      {
        id: 2,
        title: 'Data: Temperature Records 1980-2024',
        description: 'Average global temperature increase: 1.1°C over 44 years',
        connectedTo: [3],
        color: 'purple',
        offset: 'translate-x-96 translate-y-0',
      },
      {
        id: 3,
        title: 'Analysis: Correlation Study',
        description: 'Strong positive correlation (r=0.89) between CO2 and temperature',
        connectedTo: [],
        color: 'cyan',
        offset: 'translate-x-52 translate-y-96',
      },
    ],
    2: [ // Design Team
      {
        id: 1,
        title: 'UI/UX Principles',
        description: 'Core design principles for user interface and experience',
        connectedTo: [2],
        color: 'purple',
        offset: 'translate-x-0 translate-y-0',
      },
      {
        id: 2,
        title: 'Design System Components',
        description: 'Reusable components library and design tokens',
        connectedTo: [3],
        color: 'cyan',
        offset: 'translate-x-96 translate-y-0',
      },
      {
        id: 3,
        title: 'User Research Findings',
        description: 'Key insights from user interviews and testing sessions',
        connectedTo: [],
        color: 'purple',
        offset: 'translate-x-48 translate-y-80',
      },
    ],
    3: [ // Personal
      {
        id: 1,
        title: 'Weekly Schedule: Jan 6-12',
        description: 'Monday: Dentist 9am, Gym 6pm | Tuesday: Team meeting 2pm | Wednesday: Date night 7pm',
        connectedTo: [2],
        color: 'cyan',
        offset: 'translate-x-0 translate-y-0',
      },
      {
        id: 2,
        title: 'Book Notes: Atomic Habits',
        description: 'Key takeaway: Focus on systems, not goals. Make habits obvious, attractive, easy, and satisfying.',
        connectedTo: [3],
        color: 'purple',
        offset: 'translate-x-96 translate-y-0',
      },
      {
        id: 3,
        title: 'Grocery List & Meal Prep',
        description: 'Buy: spinach, chicken, quinoa, eggs | Prep Sunday: overnight oats, chicken bowls',
        connectedTo: [],
        color: 'cyan',
        offset: 'translate-x-52 translate-y-96',
      },
    ],
  });

  const currentNotes = workspaceNotes[currentWorkspace.id] || [];

  // Initialize history with current state on mount
  useEffect(() => {
    if (history.length === 0) {
      const initialSnapshot = {
        workspaceNotes: JSON.parse(JSON.stringify(workspaceNotes)),
        notePositions: JSON.parse(JSON.stringify(notePositions))
      };
      setHistory([initialSnapshot]);
      setHistoryIndex(0);
    }
  }, []);

  // Save current state to history
  const saveToHistory = () => {
    const snapshot = {
      workspaceNotes: JSON.parse(JSON.stringify(workspaceNotes)),
      notePositions: JSON.parse(JSON.stringify(notePositions))
    };
    
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    
    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  // Keyboard shortcuts for undo/redo and copy/paste
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input/textarea
      const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                            document.activeElement.tagName === 'TEXTAREA';
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setWorkspaceNotes(nextState.workspaceNotes);
            setNotePositions(nextState.notePositions);
            setHistoryIndex(historyIndex + 1);
          }
        } else {
          // Undo
          if (historyIndex > 0) {
            const previousState = history[historyIndex - 1];
            setWorkspaceNotes(previousState.workspaceNotes);
            setNotePositions(previousState.notePositions);
            setHistoryIndex(historyIndex - 1);
          }
        }
      }
      
      // Copy: Cmd+C / Ctrl+C
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !isInputFocused) {
        if (selectedNodes.length > 0) {
          e.preventDefault();
          const nodesToCopy = currentNotes.filter(note => selectedNodes.includes(note.id));
          setCopiedNodes(nodesToCopy.map(node => ({
            ...node,
            position: notePositions[node.id]
          })));
        }
      }
      
      // Paste: Cmd+V / Ctrl+V
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !isInputFocused) {
        if (copiedNodes.length > 0) {
          e.preventDefault();
          saveToHistory();
          
          const currentWorkspaceNotes = workspaceNotes[currentWorkspace.id] || [];
          const maxId = currentWorkspaceNotes.length > 0 
            ? Math.max(...currentWorkspaceNotes.map(n => n.id)) 
            : 0;
          
          const idMap = {};
          const newNodes = copiedNodes.map((node, index) => {
            const newId = maxId + index + 1;
            idMap[node.id] = newId;
            return {
              ...node,
              id: newId,
              // Clear connections for pasted nodes
              connectedTo: []
            };
          });
          
          // Update positions with offset
          const newPositions = { ...notePositions };
          copiedNodes.forEach((node, index) => {
            const newId = maxId + index + 1;
            if (node.position) {
              newPositions[newId] = {
                x: node.position.x + 50,
                y: node.position.y + 50
              };
            }
          });
          
          setWorkspaceNotes({
            ...workspaceNotes,
            [currentWorkspace.id]: [...currentWorkspaceNotes, ...newNodes]
          });
          setNotePositions(newPositions);
          
          // Select the newly pasted nodes
          setSelectedNodes(newNodes.map(n => n.id));
          setRightPanelOpen(newNodes.length === 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedNodes, currentNotes, copiedNodes, notePositions, workspaceNotes, currentWorkspace.id]);

  // Update page title when workspace changes
  useEffect(() => {
    document.title = `${currentWorkspace.name} - Mesh`;
  }, [currentWorkspace]);

  // Reset selection when workspace changes
  useEffect(() => {
    setSelectedNodes([]);
    setRightPanelOpen(false);
  }, [currentWorkspace.id]);

  const handleSelectNode = (nodeId, isShiftKey) => {
    if (isShiftKey) {
      // Multi-select: toggle node in selection
      setSelectedNodes(prev =>
        prev.includes(nodeId)
          ? prev.filter(id => id !== nodeId)
          : [...prev, nodeId]
      );
      setRightPanelOpen(true);
    } else {
      if (selectedNodes.length === 1 && selectedNodes[0] === nodeId) {
        // Clicking the same single node - toggle panel closed and deselect
        setSelectedNodes([]);
        setRightPanelOpen(false);
      } else {
        // Clicking a different node - open panel and select
        setSelectedNodes([nodeId]);
        setRightPanelOpen(true);
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    // Search for all matching notes
    const matches = currentNotes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(matches);
    setCurrentSearchIndex(0);

    if (matches.length > 0 && canvasRef.current) {
      canvasRef.current.panToNote(matches[0].id);
      setSelectedNodes([matches[0].id]);
      setRightPanelOpen(true);
    }
  };

  const handleSearchNavigate = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex - 1;
      if (newIndex < 0) newIndex = searchResults.length - 1;
    }

    setCurrentSearchIndex(newIndex);
    const targetNote = searchResults[newIndex];
    
    if (targetNote && canvasRef.current) {
      canvasRef.current.panToNote(targetNote.id);
      setSelectedNodes([targetNote.id]);
      setRightPanelOpen(true);
    }
  };

  const handleCreateNode = () => {
    saveToHistory();
    
    const currentWorkspaceNotes = workspaceNotes[currentWorkspace.id] || [];
    const newId = currentWorkspaceNotes.length > 0 
      ? Math.max(...currentWorkspaceNotes.map(n => n.id)) + 1 
      : 1;
    
    const newNode = {
      id: newId,
      title: 'New Node',
      description: 'Click to add description...',
      connectedTo: [],
      color: newId % 2 === 0 ? 'purple' : 'cyan',
      offset: 'translate-x-0 translate-y-0',
    };

    setWorkspaceNotes({
      ...workspaceNotes,
      [currentWorkspace.id]: [...currentWorkspaceNotes, newNode]
    });

    // Select the new node
    setSelectedNodes([newId]);
    setRightPanelOpen(true);
  };

  const handleCreateGroup = () => {
    const currentGroups = workspaceGroups[currentWorkspace.id] || [];
    const newId = currentGroups.length > 0 
      ? Math.max(...currentGroups.map(g => g.id)) + 1 
      : 1;
    
    const newGroup = {
      id: newId,
      label: 'New Group',
      x: 200,
      y: 200,
      width: 400,
      height: 300,
      color: newId % 2 === 0 ? 'purple' : 'cyan',
      nodeIds: []
    };

    setWorkspaceGroups({
      ...workspaceGroups,
      [currentWorkspace.id]: [...currentGroups, newGroup]
    });
  };

  const handleUpdateNode = (nodeId, updates) => {
    const currentWorkspaceNotes = workspaceNotes[currentWorkspace.id] || [];
    const updatedNotes = currentWorkspaceNotes.map(note =>
      note.id === nodeId ? { ...note, ...updates } : note
    );

    setWorkspaceNotes({
      ...workspaceNotes,
      [currentWorkspace.id]: updatedNotes
    });
  };

  const handleUpdateGroup = (groupId, updates) => {
    const currentGroups = workspaceGroups[currentWorkspace.id] || [];
    const updatedGroups = currentGroups.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    );

    setWorkspaceGroups({
      ...workspaceGroups,
      [currentWorkspace.id]: updatedGroups
    });
  };

  const handleDeleteGroup = (groupId) => {
    const currentGroups = workspaceGroups[currentWorkspace.id] || [];
    setWorkspaceGroups({
      ...workspaceGroups,
      [currentWorkspace.id]: currentGroups.filter(g => g.id !== groupId)
    });
  };
  const handleAddConnection = (fromId, toId) => {
    saveToHistory();
    
    const currentWorkspaceNotes = workspaceNotes[currentWorkspace.id] || [];
    const updatedNotes = currentWorkspaceNotes.map(note => {
      if (note.id === fromId) {
        const connectedTo = note.connectedTo || [];
        if (!connectedTo.includes(toId)) {
          return { ...note, connectedTo: [...connectedTo, toId] };
        }
      }
      return note;
    });

    setWorkspaceNotes({
      ...workspaceNotes,
      [currentWorkspace.id]: updatedNotes
    });
  };

  const handlePositionUpdate = (positions) => {
    setNotePositions(positions);
  };

  const handlePositionChangeComplete = () => {
    // Save to history when position change is complete (on mouse up)
    saveToHistory();
  };

  const handleCopyNode = (nodeId) => {
    const nodesToCopy = currentNotes.filter(note => note.id === nodeId);
    setCopiedNodes(nodesToCopy.map(node => ({
      ...node,
      position: notePositions[node.id]
    })));
  };

  const handleCreateWorkspace = (data) => {
    // In a real app, this would create the workspace
    console.log('Create workspace:', data);
  };

  const handleJoinWorkspace = (data) => {
    // In a real app, this would join the workspace
    console.log('Join workspace:', data);
  };

  const handleDeleteNode = (nodeId) => {
    saveToHistory();
    
    const currentWorkspaceNotes = workspaceNotes[currentWorkspace.id] || [];
    
    // Remove the node
    const updatedNotes = currentWorkspaceNotes.filter(note => note.id !== nodeId);
    
    // Remove connections to this node from other nodes
    const notesWithUpdatedConnections = updatedNotes.map(note => ({
      ...note,
      connectedTo: (note.connectedTo || []).filter(id => id !== nodeId)
    }));
    
    setWorkspaceNotes({
      ...workspaceNotes,
      [currentWorkspace.id]: notesWithUpdatedConnections
    });
    
    // Remove position data
    const newPositions = { ...notePositions };
    delete newPositions[nodeId];
    setNotePositions(newPositions);
    
    // Clear selection if deleted node was selected
    setSelectedNodes(prev => prev.filter(id => id !== nodeId));
    if (selectedNodes.includes(nodeId) && selectedNodes.length === 1) {
      setRightPanelOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onWorkspaceChange={setCurrentWorkspace}
        onOpenWorkspaceModal={() => setShowWorkspaceModal(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onCreateNode={handleCreateNode}
          searchResultsCount={searchResults.length}
          currentSearchIndex={currentSearchIndex}
          onSearchNavigate={handleSearchNavigate}
        />

        {/* Canvas + Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          <Canvas 
            ref={canvasRef}
            selectedNodes={selectedNodes} 
            onSelectNode={handleSelectNode} 
            notes={currentNotes}
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            rightPanelOpen={rightPanelOpen}
            onRightPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            searchResultsCount={searchResults.length}
            currentSearchIndex={currentSearchIndex}
            onSearchNavigate={handleSearchNavigate}
            onUpdateNote={handleUpdateNode}
            onAddConnection={handleAddConnection}
            notePositions={notePositions}
            onPositionUpdate={handlePositionUpdate}
            onPositionChangeComplete={handlePositionChangeComplete}
            onCreateNode={handleCreateNode}
            groups={workspaceGroups[currentWorkspace.id] || []}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onCopyNode={handleCopyNode}
            onDeleteNode={handleDeleteNode}
          />
          {!isFullscreen && (
            <RightPanel 
              isOpen={rightPanelOpen} 
              selectedNode={selectedNodes.length === 1 ? selectedNodes[0] : null} 
              selectedNote={selectedNodes.length === 1 ? currentNotes.find(note => note.id === selectedNodes[0]) : null}
              allNotes={currentNotes}
              onToggle={() => setRightPanelOpen(!rightPanelOpen)}
              isFullscreen={false}
              onUpdateNote={handleUpdateNode}
            />
          )}
        </div>
      </div>

      {/* Workspace Modal - Renders on top of everything */}
      <WorkspaceModal
        isOpen={showWorkspaceModal}
        onClose={() => setShowWorkspaceModal(false)}
        onCreateWorkspace={handleCreateWorkspace}
        onJoinWorkspace={handleJoinWorkspace}
      />
    </div>
  );
}