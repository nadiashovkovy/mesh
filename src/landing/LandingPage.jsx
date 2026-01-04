import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, GitBranch, Zap, Network, Globe, Building2, GraduationCap, Sparkles, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/MeshLogo.png" alt="Mesh Logo" className="w-6 h-6" />
            <span className="font-bold text-xl">Mesh</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-cyan-400 transition">Features</a>
            <a href="#why-mesh" className="text-slate-300 hover:text-cyan-400 transition">Why Mesh</a>
            <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/app" className="text-slate-300 hover:text-cyan-400 transition">Sign In</Link>
            <Link to="/app" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90 transition font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 mb-6">
            <span className="text-sm text-cyan-400">Collaborative Thinking & Research Tool</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Think Together.<br />Build Knowledge.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            The real-time collaborative knowledge base for teams who build ideas together. 
            No more scattered notes. No more lost insights. Just connected thinking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/app" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90 transition font-medium text-lg flex items-center gap-2">
              Start Building Free
              <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium text-lg">
              Watch Demo
            </button>
          </div>

          {/* Demo/Preview Image Placeholder */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 aspect-video flex items-center justify-center">
              <div className="text-slate-600 text-lg">Product Demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">The Problem</h2>
          <p className="text-xl text-slate-300 mb-12 text-center max-w-4xl mx-auto">
            Knowledge work is fragmented. Teams are scattered across disconnected tools, 
            insights get buried, and collaboration is impossible.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-red-400 mb-4">❌</div>
              <h3 className="text-xl font-semibold mb-3">Notion</h3>
              <p className="text-slate-400">Powerful but bloated for research. Too many features, too much friction.</p>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-red-400 mb-4">❌</div>
              <h3 className="text-xl font-semibold mb-3">Obsidian</h3>
              <p className="text-slate-400">Perfect for individuals, but zero collaboration. Teams can't build together.</p>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-red-400 mb-4">❌</div>
              <h3 className="text-xl font-semibold mb-3">Google Docs</h3>
              <p className="text-slate-400">Collaboration without structure. No interconnection, no knowledge graph.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for How Teams Think</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to collaborate, connect ideas, and build knowledge together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Real-Time Collaboration */}
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl hover:border-cyan-400/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Collaboration</h3>
              <p className="text-slate-300 mb-4">
                Work together seamlessly as ideas flow. See teammates' cursors, edits, and thoughts in real-time. 
                No merge conflicts, no outdated information.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Live cursor tracking
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Instant updates
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Team presence indicators
                </li>
              </ul>
            </div>

            {/* Knowledge Graphs */}
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl hover:border-purple-400/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <GitBranch size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Bidirectional Linking & Knowledge Graphs</h3>
              <p className="text-slate-300 mb-4">
                Every idea connects. Create links between notes and watch your knowledge graph grow. 
                Visualize relationships and discover unexpected connections.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-purple-400" />
                  Auto-link suggestions
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-purple-400" />
                  Visual graph explorer
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-purple-400" />
                  Connection analytics
                </li>
              </ul>
            </div>

            {/* Visual Workspaces */}
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl hover:border-cyan-400/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Network size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visual Research Workspaces</h3>
              <p className="text-slate-300 mb-4">
                Move beyond linear documents. Canvas-based workspaces let you map themes, organize research, 
                and visualize arguments. Thinking becomes tangible.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Infinite canvas
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Drag & connect nodes
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Zoom & pan controls
                </li>
              </ul>
            </div>

            {/* Team Intelligence */}
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl hover:border-purple-400/50 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Team Intelligence</h3>
              <p className="text-slate-300 mb-4">
                Mesh learns your research patterns. Auto-suggestions, intelligent tagging, and collaborative search 
                help teams surface relevant knowledge instantly.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-purple-400" />
                  Smart suggestions
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-purple-400" />
                  Powerful search
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-purple-400" />
                  Learning algorithms
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Mesh Wins */}
      <section id="why-mesh" className="py-20 px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Mesh Wins</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <Zap className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-2xl font-semibold mb-3">Built for Research, Not Bloat</h3>
              <p className="text-slate-300">
                Purpose-built for research and knowledge work. Clean interface, fast performance, 
                powerful search—no features you don't need.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <Network className="text-purple-400 mb-4" size={32} />
              <h3 className="text-2xl font-semibold mb-3">Network Effects Through Linking</h3>
              <p className="text-slate-300">
                The more teams use Mesh, the more valuable it becomes. Interconnected knowledge bases 
                create defensible moats and exponential team benefits.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <Globe className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-2xl font-semibold mb-3">Fills a Real Market Gap</h3>
              <p className="text-slate-300">
                Obsidian owns personal notes. Notion owns project management. 
                But no tool has solved collaborative research. That's Mesh.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <Building2 className="text-purple-400 mb-4" size={32} />
              <h3 className="text-2xl font-semibold mb-3">Institutional & Academic Partnerships</h3>
              <p className="text-slate-300">
                Universities, research labs, and enterprises need this. Large budgets, 
                multi-user deployments, long contracts, low churn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Pricing</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free Tier */}
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm">Free</span>
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-300 mb-8">Perfect for getting started with memory as a service.</p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-slate-300">1000000 tokens processed</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">10K search queries</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Email support</span>
                </div>
              </div>
              
              <button className="w-full py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium">
                Try for free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col relative">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm">Pro</span>
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold">$19</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-300 mb-8">Memory for power users and quick moving teams.</p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-slate-300">3000000 tokens processed</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">100K search queries</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                      <path d="M3 10h18" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Priority support</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3v18h18" strokeWidth="2"/>
                      <path d="M18 17l-3-3-3 3-3-3-3 3" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Advanced analytics</span>
                </div>
              </div>
              
              <button className="w-full py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2">
                Get started with Pro
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Scale Tier */}
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm">Scale</span>
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold">$399</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-300 mb-8">Enterprise-grade memory for large organisations with dedicated support.</p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-slate-300">80000000 tokens processed</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">20M search queries</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                      <path d="M3 10h18" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Dedicated support</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Custom Integration</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Slack Support Channel</span>
                </div>
              </div>
              
              <button className="w-full py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2">
                Get started with Scale
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm">Enterprise</span>
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold">Custom</span>
              </div>
              <p className="text-slate-300 mb-8">Enterprise plans available with custom token limits, dedicated support, and SLA guarantees.</p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-slate-300">Unlimited token usage</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Unlimited search queries</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                      <path d="M3 10h18" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Forward deployed engineer</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Custom integration</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Dedicated support + Slack Channel</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Faster latency</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-slate-300">Self own data</span>
                </div>
              </div>
              
              <button className="w-full py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium">
                Send a mail
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Markets */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Built For Teams Who Think</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl">
              <GraduationCap className="text-cyan-400 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Academia & Research</h3>
              <p className="text-slate-400">Research teams, universities, think tanks, R&D departments</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl">
              <Building2 className="text-purple-400 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Enterprise Teams</h3>
              <p className="text-slate-400">Product teams, legal research, consulting firms, creative teams</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl">
              <Users className="text-cyan-400 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Knowledge Workers</h3>
              <p className="text-slate-400">Journalists, analysts, strategists, anyone building on ideas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Knowledge Together?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start free. No credit card required. Collaborate in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:opacity-90 transition font-medium text-lg flex items-center gap-2">
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium text-lg">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/assets/MeshLogo.png" alt="Mesh Logo" className="w-5 h-5" />
                <span className="font-bold">Mesh</span>
              </div>
              <p className="text-sm text-slate-400">
                Collaborative thinking for teams who build knowledge together.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Security</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Community</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <p>&copy; 2026 Mesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
