import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Store, 
  Brain, 
  Users, 
  Settings, 
  Zap,
  Wand2,
  Search
} from 'lucide-react';

interface SimpleSidebarProps {
  collapsed?: boolean;
  onMenuToggle?: () => void;
}

const SimpleSidebar: React.FC<SimpleSidebarProps> = ({ collapsed = false, onMenuToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      id: 'environment-hub',
      path: '/',
      label: 'Environment Hub',
      icon: Home,
      description: 'Manage your workspaces'
    },
    {
      id: 'create-workspace',
      path: '/create',
      label: 'Create Workspace',
      icon: Plus,
      description: 'Set up new workspace'
    },
    {
      id: 'marketplace',
      path: '/marketplace',
      label: 'Marketplace',
      icon: Store,
      description: 'Browse templates'
    },
    {
      id: 'ai-center',
      path: '/ai-center',
      label: 'AI Command Center',
      icon: Brain,
      description: 'AI recommendations'
    },
    {
      id: 'community',
      path: '/community',
      label: 'Community Hub',
      icon: Users,
      description: 'Connect with developers'
    },
    {
      id: 'v3-ultimate',
      path: '/v3-ultimate',
      label: 'Dashboard Overview',
      icon: Zap,
      description: 'System overview and metrics'
    },
    {
      id: 'wow-factor',
      path: '/wow-factor',
      label: 'Performance Monitor',
      icon: Wand2,
      description: 'Real-time system monitoring'
    }
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-full glass-sidebar flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-center px-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold text-gradient-ai">NUFFI</div>
              <div className="text-xs text-accent-blue">AI Dev Environment</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.id} to={item.path}>
                <div
                  className={`flex items-center ${collapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-blue/20 to-accent-green/20 text-white border border-accent-blue/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : ''}`} />
                  
                  {!collapsed && (
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link to="/settings">
          <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-2.5 rounded-lg cursor-pointer hover:bg-white/5 transition-all duration-200`}>
            <Settings className="w-5 h-5 text-gray-400" />
            {!collapsed && (
              <span className="text-sm font-medium text-gray-300">Settings</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SimpleSidebar;