import React from 'react';
import { Search, Star, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full overflow-auto relative">
      <div className="p-6">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gradient-ai mb-1">Marketplace</h1>
          <p className="text-text-secondary text-sm">Browse and discover amazing templates</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search templates..."
              className="glass-input w-full pl-10"
            />
          </div>
          <motion.button 
            className="ai-button-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </motion.button>
        </motion.div>

        {/* Templates Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className="glass-card hover-lift"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                rotateY: 2,
                rotateX: 2
              }}
              whileTap={{ scale: 0.98 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary mb-2">{template.name}</h3>
                <p className="text-text-secondary text-sm">{template.description}</p>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-text-muted">
                <span>by {template.author}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent-orange" />
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
                    className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded border border-accent-blue/20 text-xs backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <motion.button 
                className="ai-button w-full"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Use Template
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marketplace;