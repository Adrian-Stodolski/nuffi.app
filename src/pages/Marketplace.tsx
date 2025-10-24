import React from 'react';
import { Search, Star, Download, Filter } from 'lucide-react';

const Marketplace: React.FC = () => {
  const templates = [
    {
      id: 1,
      name: 'React + TypeScript',
      description: 'Modern React development with TypeScript',
      author: 'NUFFI Team',
      downloads: 1234,
      rating: 4.8,
      tags: ['React', 'TypeScript', 'Vite']
    },
    {
      id: 2,
      name: 'Node.js API',
      description: 'Express.js REST API with MongoDB',
      author: 'Community',
      downloads: 856,
      rating: 4.6,
      tags: ['Node.js', 'Express', 'MongoDB']
    },
    {
      id: 3,
      name: 'Python Data Science',
      description: 'Jupyter, Pandas, NumPy setup',
      author: 'Data Team',
      downloads: 642,
      rating: 4.9,
      tags: ['Python', 'Jupyter', 'Pandas']
    }
  ];

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Marketplace</h1>
          <p className="text-gray-400 text-sm">Browse templates</p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <button className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm">{template.description}</p>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <span>by {template.author}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{template.downloads}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;