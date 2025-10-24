import React from 'react';
import { Users, MessageCircle, Heart, Share, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Community: React.FC = () => {
  const posts = [
    {
      id: 1,
      author: {
        name: 'Alex Chen',
        avatar: '👨‍💻',
        reputation: 1250
      },
      type: 'template_share',
      title: 'React + Tailwind + TypeScript Starter',
      content: 'Just shared my production-ready React template with authentication, routing, and state management.',
      likes: 24,
      comments: 8,
      createdAt: '2 hours ago',
      tags: ['React', 'TypeScript', 'Tailwind']
    },
    {
      id: 2,
      author: {
        name: 'Sarah Kim',
        avatar: '👩‍🔬',
        reputation: 890
      },
      type: 'question',
      title: 'Best practices for Docker in development?',
      content: 'What are your go-to Docker configurations for local development? Looking for tips on volume mounting and networking.',
      likes: 12,
      comments: 15,
      createdAt: '4 hours ago',
      tags: ['Docker', 'DevOps']
    },
    {
      id: 3,
      author: {
        name: 'Mike Johnson',
        avatar: '🚀',
        reputation: 2100
      },
      type: 'showcase',
      title: 'Built a ML workspace with GPU support',
      content: 'Created a complete machine learning environment with CUDA, PyTorch, and Jupyter. Available in marketplace!',
      likes: 45,
      comments: 12,
      createdAt: '1 day ago',
      tags: ['ML', 'Python', 'CUDA']
    }
  ];

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'template_share': return '📦';
      case 'question': return '❓';
      case 'showcase': return '🎉';
      default: return '💬';
    }
  };

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
          <h1 className="text-2xl font-bold text-gradient-ai mb-1">Community Hub</h1>
          <p className="text-text-secondary text-sm">Connect with developers worldwide</p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Users</p>
                <p className="text-2xl font-bold text-text-primary">1,247</p>
              </div>
              <Users className="w-8 h-8 text-accent-blue" />
            </div>
          </motion.div>
          
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Templates Shared</p>
                <p className="text-2xl font-bold text-text-primary">342</p>
              </div>
              <Share className="w-8 h-8 text-accent-green" />
            </div>
          </motion.div>
          
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Discussions</p>
                <p className="text-2xl font-bold text-text-primary">89</p>
              </div>
              <MessageCircle className="w-8 h-8 text-accent-purple" />
            </div>
          </motion.div>
          
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-text-primary">2,156</p>
              </div>
              <Heart className="w-8 h-8 text-accent-red" />
            </div>
          </motion.div>
        </motion.div>

        {/* Community Feed */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="glass-card hover-lift"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              {/* Post Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="text-2xl">{post.author.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-text-primary">{post.author.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-accent-orange" />
                      <span className="text-xs text-text-muted">{post.author.reputation}</span>
                    </div>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">{post.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                    <h2 className="text-lg font-semibold text-text-primary">{post.title}</h2>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-text-secondary mb-4 leading-relaxed">{post.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded border border-accent-blue/20 text-xs backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 text-text-muted">
                <motion.button 
                  className="flex items-center space-x-2 hover:text-accent-red transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </motion.button>
                <motion.button 
                  className="flex items-center space-x-2 hover:text-accent-blue transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </motion.button>
                <motion.button 
                  className="flex items-center space-x-2 hover:text-accent-green transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="ai-button-secondary px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Load More Posts
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;