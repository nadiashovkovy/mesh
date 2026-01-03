import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Canvas from '../components/Canvas';
import RightPanel from '../components/RightPanel';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 1, name: 'Research Lab', active: 3 });

  // Workspace-specific notes
  const workspaceNotes = {
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
  };

  const currentNotes = workspaceNotes[currentWorkspace.id] || [];

  // Update page title when workspace changes
  useEffect(() => {
    document.title = `${currentWorkspace.name} - Mesh`;
  }, [currentWorkspace]);

  // Reset selection when workspace changes
  useEffect(() => {
    setSelectedNode(null);
    setRightPanelOpen(false);
  }, [currentWorkspace.id]);

  const handleSelectNode = (nodeId) => {
    if (selectedNode === nodeId) {
      // Clicking the same node - toggle panel closed and deselect
      setSelectedNode(null);
      setRightPanelOpen(false);
    } else {
      // Clicking a different node - open panel and select
      setSelectedNode(nodeId);
      setRightPanelOpen(true);
    }
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
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Canvas + Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          <Canvas selectedNode={selectedNode} onSelectNode={handleSelectNode} notes={currentNotes} />
          <RightPanel isOpen={rightPanelOpen} selectedNode={selectedNode} onToggle={() => setRightPanelOpen(!rightPanelOpen)} />
        </div>
      </div>
    </div>
  );
}