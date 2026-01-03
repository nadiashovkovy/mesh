import React, { useState } from 'react';
import { X, Plus, Mail, Users, Check } from 'lucide-react';

export default function WorkspaceModal({ isOpen, onClose, onCreateWorkspace, onJoinWorkspace }) {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const [workspaceName, setWorkspaceName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingInvites, setPendingInvites] = useState([
    { id: 1, workspace: 'Design Team', invitedBy: 'Sarah Johnson', date: '2 days ago' },
    { id: 2, workspace: 'Product Research', invitedBy: 'Mike Chen', date: '1 week ago' },
  ]);

  if (!isOpen) return null;

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      onCreateWorkspace({ name: workspaceName });
      setWorkspaceName('');
      onClose();
    }
  };

  const handleJoinWithCode = (e) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      onJoinWorkspace({ code: inviteCode });
      setInviteCode('');
      onClose();
    }
  };

  const handleAcceptInvite = (invite) => {
    onJoinWorkspace({ inviteId: invite.id, workspace: invite.workspace });
    setPendingInvites(pendingInvites.filter(i => i.id !== invite.id));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Workspace Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'create'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={18} />
              Create New
            </div>
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'join'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users size={18} />
              Join Workspace
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'create' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Create a New Workspace</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Workspaces help you organize projects and collaborate with your team.
                </p>
              </div>

              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g., Research Lab, Design Team"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!workspaceName.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Workspace
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-800 rounded-lg font-medium hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-slate-800">
                <h4 className="text-sm font-medium mb-3 text-slate-300">What you can do:</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Invite team members via email or share an invite link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Organize notes and knowledge collaboratively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Set permissions and manage team access</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Invites */}
              {pendingInvites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
                  <div className="space-y-3">
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{invite.workspace}</div>
                          <div className="text-sm text-slate-400">
                            Invited by {invite.invitedBy} • {invite.date}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptInvite(invite)}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-purple-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setPendingInvites(pendingInvites.filter(i => i.id !== invite.id))}
                            className="px-4 py-2 bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-600 transition"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Join with Code */}
              <div className={pendingInvites.length > 0 ? 'pt-6 border-t border-slate-800' : ''}>
                <h3 className="text-lg font-semibold mb-2">Join with Invite Code</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Enter the invitation code shared by your team member.
                </p>

                <form onSubmit={handleJoinWithCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Invite Code
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="e.g., MESH-ABC123"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent uppercase"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!inviteCode.trim()}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Join Workspace
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-slate-800 rounded-lg font-medium hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Request Invite by Email */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-semibold mb-2">Request Invitation</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Enter your email to request access to a workspace.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!inviteEmail.trim()}
                    className="w-full px-6 py-3 bg-slate-800 border border-slate-700 rounded-lg font-medium hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Request Invitation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
