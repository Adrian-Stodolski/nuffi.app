import React from 'react';
import { Users, MessageCircle, Heart, Share, Star } from 'lucide-react';

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

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Community Hub</h1>
          <p className="text-gray-400 text-sm">Connect with developers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Templates Shared</p>
                <p className="text-2xl font-bold text-white">342</p>
              </div>
              <Share className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Discussions</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
              <MessageCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-white">2,156</p>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Community Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="text-2xl">{post.author.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-white">{post.author.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-400">{post.author.reputation}</span>
                    </div>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{post.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                    <h2 className="text-lg font-semibold text-white">{post.title}</h2>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 text-gray-400">
                <button className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                  <Share className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg border border-gray-700 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;