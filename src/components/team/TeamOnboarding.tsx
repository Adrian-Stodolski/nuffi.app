import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Settings, Mail, Copy, Check, Building, UserPlus, Shield } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'invited' | 'active' | 'pending';
  invitedAt: Date;
  workspace?: string;
}

interface CompanyTemplate {
  id: string;
  role: string;
  baseTemplate: string;
  customTools: string[];
  members: number;
  lastUpdated: Date;
}

export const TeamOnboarding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'members' | 'invite'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'Frontend Developer'
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@acmecorp.com',
      role: 'Frontend Developer',
      status: 'active',
      invitedAt: new Date('2024-01-15'),
      workspace: 'Frontend Complete'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@acmecorp.com',
      role: 'Backend Developer',
      status: 'pending',
      invitedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      email: 'alex@acmecorp.com',
      role: 'DevOps Engineer',
      status: 'invited',
      invitedAt: new Date('2024-01-22')
    }
  ];

  const companyTemplates: CompanyTemplate[] = [
    {
      id: '1',
      role: 'Frontend Developer',
      baseTemplate: 'Frontend Complete',
      customTools: ['Slack', 'Figma', 'Acme CLI'],
      members: 8,
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: '2',
      role: 'Backend Developer',
      baseTemplate: 'Backend Complete',
      customTools: ['Docker', 'Acme API Tools', 'Company VPN'],
      members: 12,
      lastUpdated: new Date('2024-01-18')
    },
    {
      id: '3',
      role: 'DevOps Engineer',
      baseTemplate: 'DevOps Complete',
      customTools: ['Kubernetes', 'Terraform', 'Company Monitoring'],
      members: 4,
      lastUpdated: new Date('2024-01-15')
    }
  ];

  const handleInvite = () => {
    console.log('Sending invite to:', inviteForm);
    setShowInviteModal(false);
    setInviteForm({ email: '', name: '', role: 'Frontend Developer' });
  };

  const copyInviteLink = () => {
    const link = `https://nuffi.app/onboard/xyz123-${inviteForm.role.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-accent-green bg-accent-green-10';
      case 'pending': return 'text-accent-orange bg-accent-orange-10';
      case 'invited': return 'text-accent-blue bg-accent-blue-10';
      default: return 'text-text-muted bg-bg-quaternary';
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.4)",
                    "0 0 30px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-ai">Team Onboarding</h1>
                <p className="text-text-secondary">Streamline your team's development environment setup with standardized workspace templates</p>
              </div>
            </div>
          </motion.div>

          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity
                  }}
                >
                  <Building className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Acme Corp</h2>
                  <p className="text-text-secondary">acmecorp.com • Team Plan</p>
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-2xl font-bold text-accent-blue"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  47
                </motion.div>
                <div className="text-text-secondary">Team Members</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-1 glass-card p-1"
          >
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'templates', label: 'Role Templates', icon: Settings },
              { id: 'members', label: 'Team Members', icon: UserPlus },
              { id: 'invite', label: 'Invite Members', icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-glow'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-quaternary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Stats Cards */}
                <div className="glass-card text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-accent-blue rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-accent-green mb-2">45</div>
                  <div className="text-text-secondary">Active Workspaces</div>
                </div>

                <div className="glass-card text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-accent-blue mb-2">3</div>
                  <div className="text-text-secondary">Role Templates</div>
                </div>

                <div className="glass-card text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-orange rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-accent-purple mb-2">2</div>
                  <div className="text-text-secondary">Pending Invites</div>
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-text-primary">Role Templates</h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="ai-button flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Template
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companyTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="glass-card cursor-pointer hover-lift"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-text-secondary">Members</div>
                          <div className="text-lg font-bold text-accent-blue">{template.members}</div>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-text-primary mb-2">{template.role}</h4>
                      <p className="text-text-secondary text-sm mb-4">Based on {template.baseTemplate}</p>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-text-secondary mb-2">Custom Tools:</div>
                          <div className="flex flex-wrap gap-2">
                            {template.customTools.slice(0, 2).map((tool) => (
                              <span key={tool} className="px-2 py-1 bg-bg-quaternary rounded text-xs text-text-secondary">
                                {tool}
                              </span>
                            ))}
                            {template.customTools.length > 2 && (
                              <span className="px-2 py-1 bg-bg-quaternary rounded text-xs text-text-muted">
                                +{template.customTools.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-text-muted">
                          Updated {template.lastUpdated.toLocaleDateString()}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-4 py-2 rounded-lg font-medium bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                      >
                        Edit Template
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-text-primary">Team Members</h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInviteModal(true)}
                    className="ai-button flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                  </motion.button>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg-quaternary">
                        <tr>
                          <th className="text-left p-4 text-text-secondary font-medium">Member</th>
                          <th className="text-left p-4 text-text-secondary font-medium">Role</th>
                          <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                          <th className="text-left p-4 text-text-secondary font-medium">Workspace</th>
                          <th className="text-left p-4 text-text-secondary font-medium">Invited</th>
                          <th className="text-left p-4 text-text-secondary font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((member) => (
                          <tr key={member.id} className="border-t border-border hover:bg-bg-quaternary/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-text-primary">{member.name}</div>
                                  <div className="text-sm text-text-secondary">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-text-secondary">{member.role}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                {member.status}
                              </span>
                            </td>
                            <td className="p-4 text-text-secondary">{member.workspace || '-'}</td>
                            <td className="p-4 text-text-muted text-sm">
                              {member.invitedAt.toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <button className="text-accent-blue hover:text-accent-green text-sm">
                                Resend Invite
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'invite' && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass-card space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">Invite Team Member</h3>
                    <p className="text-text-secondary">Send an invitation to join your team workspace</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={inviteForm.name}
                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                        className="glass-input w-full"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteForm.email}
                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                        className="glass-input w-full"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Role
                      </label>
                      <select
                        value={inviteForm.role}
                        onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                        className="glass-input w-full"
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Mobile Developer">Mobile Developer</option>
                        <option value="Data Scientist">Data Scientist</option>
                      </select>
                    </div>
                  </div>

                  <div className="glass-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-secondary">Invitation Link</span>
                      <button
                        onClick={copyInviteLink}
                        className="flex items-center gap-2 text-accent-blue hover:text-accent-green text-sm"
                      >
                        {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedLink ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-xs text-text-muted font-mono bg-bg-primary p-2 rounded">
                      https://nuffi.app/onboard/xyz123-{inviteForm.role.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleInvite}
                      className="ai-button flex-1"
                    >
                      Send Invitation
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="ai-button-secondary"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};