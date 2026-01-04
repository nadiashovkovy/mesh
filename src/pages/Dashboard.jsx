import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Canvas from '../components/Canvas';
import RightPanel from '../components/RightPanel';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 1, name: 'Research Lab', active: 3 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const canvasRef = useRef(null);

  // Workspace-specific notes - now using state
  const [workspaceNotes, setWorkspaceNotes] = useState({
    1: [ // Research Lab
      {
        id: 1,
        title: 'Research Question: Climate Impact',
        description: 'How do carbon emissions affect global temperatures? Initial hypothesis testing...',
        connections: 3,
        color: 'cyan',
        offset: 'translate-x-0 translate-y-0',
      },
      {
        id: 2,
        title: 'Data: Temperature Records 1980-2024',
        description: 'Average global temperature increase: 1.1°C over 44 years',
        connections: 5,
        color: 'purple',
        offset: 'translate-x-96 translate-y-0',
      },
      {
        id: 3,
        title: 'Analysis: Correlation Study',
        description: 'Strong positive correlation (r=0.89) between CO2 and temperature',
        connections: 7,
        color: 'cyan',
        offset: 'translate-x-52 translate-y-96',
      },
    ],
    2: [ // Design Team
      {
        id: 1,
        title: 'UI/UX Principles',
        description: 'Core design principles for user interface and experience',
        connections: 4,
        color: 'purple',
        offset: 'translate-x-0 translate-y-0',
      },
      {
        id: 2,
        title: 'Design System Components',
        description: 'Reusable components library and design tokens',
        connections: 6,
        color: 'cyan',
        offset: 'translate-x-96 translate-y-0',
      },
      {
        id: 3,
        title: 'User Research Findings',
        description: 'Key insights from user interviews and testing sessions',
        connections: 5,
        color: 'purple',
        offset: 'translate-x-48 translate-y-80',
      },
    ],
    3: [ // Product Strategy
      {
        id: 1,
        title: 'Market Analysis Q1 2026',
        description: 'Competitive landscape and market opportunities',
        connections: 4,
        color: 'cyan',
        offset: 'translate-x-0 translate-y-0',
      },
      {
        id: 2,
        title: 'Product Roadmap',
        description: 'Feature prioritization and release timeline',
        connections: 8,
        color: 'purple',
        offset: 'translate-x-96 translate-y-0',
      },
      {
        id: 3,
        title: 'Customer Feedback Summary',
        description: 'Top requested features and pain points',
        connections: 3,
        color: 'cyan',
        offset: 'translate-x-52 translate-y-96',
      },
    ],
  });

  const currentNotes = workspaceNotes[currentWorkspace.id] || [];

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
    const currentWorkspaceNotes = workspaceNotes[currentWorkspace.id] || [];
    const newId = currentWorkspaceNotes.length > 0 
      ? Math.max(...currentWorkspaceNotes.map(n => n.id)) + 1 
      : 1;
    
    const newNode = {
      id: newId,
      title: 'New Node',
      description: 'Click to add description...',
      connections: 0,
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

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onWorkspaceChange={setCurrentWorkspace}
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
          />
          {!isFullscreen && (
            <RightPanel 
              isOpen={rightPanelOpen} 
              selectedNode={selectedNodes.length === 1 ? selectedNodes[0] : null} 
              selectedNote={selectedNodes.length === 1 ? currentNotes.find(note => note.id === selectedNodes[0]) : null}
              onToggle={() => setRightPanelOpen(!rightPanelOpen)}
              isFullscreen={false}
              onUpdateNote={handleUpdateNode}
            />
          )}
        </div>
      </div>
    </div>
  );
}