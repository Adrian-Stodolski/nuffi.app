import React from 'react';
import { Brain, Lightbulb, TrendingUp, Zap } from 'lucide-react';

const AICenter: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      type: 'optimization',
      title: 'Optimize Memory Usage',
      description: 'Your system is using 85% memory. Consider closing unused applications.',
      priority: 'high',
      savings: '512MB memory'
    },
    {
      id: 2,
      type: 'tool',
      title: 'Install Docker',
      description: 'Docker would be useful for your containerization projects.',
      priority: 'medium',
      savings: '2 hours setup time'
    },
    {
      id: 3,
      type: 'learning',
      title: 'Learn TypeScript',
      description: 'Based on your JavaScript projects, TypeScript could improve your workflow.',
      priority: 'low',
      savings: 'Better code quality'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'low': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">AI Command Center</h1>
          <p className="text-gray-400 text-sm">AI recommendations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Scans</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Recommendations</p>
                <p className="text-2xl font-bold text-white">{recommendations.length}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Optimizations</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Time Saved</p>
                <p className="text-2xl font-bold text-white">4.2h</p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">{rec.description}</p>
                    <p className="text-green-400 text-sm">💡 Potential savings: {rec.savings}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Apply
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Brain className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Analysis</h3>
              <p className="text-gray-400 mb-4">AI analyzes your development patterns and suggests optimizations.</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                Run Analysis
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Auto Setup</h3>
              <p className="text-gray-400 mb-4">Automatically configure workspaces based on your project type.</p>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">
                Enable Auto Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICenter;