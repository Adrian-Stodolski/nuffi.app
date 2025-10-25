import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Code, 
  GitBranch, 
  Clock, 
  Zap, 
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  BarChart3
} from 'lucide-react';
import Epic3DChart from '../components/Charts/Epic3DChart';
import EpicCircularChart from '../components/Charts/EpicCircularChart';
import EpicTimeline from '../components/Charts/EpicTimeline';
import AnimatedParticles from '../components/Charts/AnimatedParticles';

const V3Ultimate: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 12
  });

  const [projectStats] = useState({
    activeProjects: 8,
    totalCommits: 1247,
    linesOfCode: 45632,
    testsRun: 892
  });

  const timelineData = [
    {
      id: '1',
      title: 'Production Deployment',
      description: 'Successfully deployed Nuffi v2.1.0 to production servers',
      time: '2 min ago',
      status: 'completed' as const,
      color: 'accent-green'
    },
    {
      id: '2',
      title: 'AI Model Training',
      description: 'Training new recommendation model with latest data',
      time: '5 min ago',
      status: 'in-progress' as const,
      color: 'accent-blue'
    },
    {
      id: '3',
      title: 'Security Scan',
      description: 'Running comprehensive security audit on all repositories',
      time: '12 min ago',
      status: 'in-progress' as const,
      color: 'accent-purple'
    },
    {
      id: '4',
      title: 'Database Backup',
      description: 'Automated backup completed successfully',
      time: '1 hour ago',
      status: 'completed' as const,
      color: 'accent-orange'
    }
  ];

  const chartData = [
    systemMetrics.cpu,
    systemMetrics.memory,
    systemMetrics.disk,
    systemMetrics.network,
    75, 82, 68, 91
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(10, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 20))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 191, 255, 0.4)",
                  "0 0 30px rgba(0, 191, 255, 0.6)",
                  "0 0 20px rgba(0, 191, 255, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-ai">Dashboard Overview</h1>
              <p className="text-text-secondary">Real-time insights into your development environment</p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Active Projects', value: projectStats.activeProjects, icon: Code, color: 'accent-blue', change: '+2' },
              { label: 'Total Commits', value: projectStats.totalCommits.toLocaleString(), icon: GitBranch, color: 'accent-green', change: '+47' },
              { label: 'Lines of Code', value: projectStats.linesOfCode.toLocaleString(), icon: Activity, color: 'accent-purple', change: '+1.2k' },
              { label: 'Tests Run', value: projectStats.testsRun, icon: Zap, color: 'accent-orange', change: '+23' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="glass-card hover-lift"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-8 h-8 text-${stat.color}`} />
                    <span className={`text-xs px-2 py-1 rounded-full bg-${stat.color}/20 text-${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Particles removed temporarily to fix white background */}

        {/* Main Dashboard Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* System Performance */}
          <motion.div 
            className="lg:col-span-2 glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-green rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">System Performance</h2>
                <p className="text-text-secondary text-sm">Real-time system metrics</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'CPU Usage', value: systemMetrics.cpu, icon: Cpu, color: 'accent-blue' },
                { label: 'Memory', value: systemMetrics.memory, icon: Server, color: 'accent-green' },
                { label: 'Disk Usage', value: systemMetrics.disk, icon: HardDrive, color: 'accent-orange' },
                { label: 'Network', value: systemMetrics.network, icon: Wifi, color: 'accent-purple' }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 text-${metric.color}`} />
                      <span className="text-sm text-text-secondary">{metric.label}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-text-primary">{metric.value}%</span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${metric.color}/20 text-${metric.color}`}>
                          {metric.value > 70 ? 'High' : metric.value > 40 ? 'Normal' : 'Low'}
                        </span>
                      </div>
                      <div className="w-full bg-bg-quaternary rounded-full h-2">
                        <motion.div
                          className={`h-2 bg-gradient-to-r from-${metric.color} to-${metric.color}/70 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Recent Activity</h2>
                <p className="text-text-secondary text-sm">Latest development events</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { action: 'Deployed to production', project: 'Nuffi Dashboard', time: '2 min ago', color: 'accent-green' },
                { action: 'Tests passed', project: 'API Service', time: '5 min ago', color: 'accent-blue' },
                { action: 'Code review completed', project: 'Frontend App', time: '12 min ago', color: 'accent-purple' },
                { action: 'Database backup', project: 'Main DB', time: '1 hour ago', color: 'accent-orange' },
                { action: 'Security scan', project: 'All Projects', time: '2 hours ago', color: 'accent-red' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-bg-quaternary/30 hover:bg-bg-quaternary/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{activity.action}</p>
                    <p className="text-xs text-text-muted">{activity.project}</p>
                  </div>
                  <span className="text-xs text-text-muted">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Epic Circular Charts */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Project Health</h2>
                <p className="text-text-secondary text-sm">Real-time health metrics</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <EpicCircularChart
                value={85}
                color="#4CAF50"
                title="Overall Health"
                subtitle="Excellent"
              />
              <EpicCircularChart
                value={92}
                color="#00BFFF"
                title="Code Quality"
                subtitle="Outstanding"
              />
              <EpicCircularChart
                value={78}
                color="#8B5CF6"
                title="Test Coverage"
                subtitle="Good"
              />
              <EpicCircularChart
                value={88}
                color="#F97316"
                title="Security Score"
                subtitle="Very Good"
              />
            </div>
          </motion.div>

          {/* Development Tools */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-red rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Development Tools</h2>
                <p className="text-text-secondary text-sm">Active development environment</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Node.js', version: 'v18.17.0', status: 'active', color: 'accent-green' },
                { name: 'React', version: 'v18.2.0', status: 'active', color: 'accent-blue' },
                { name: 'TypeScript', version: 'v5.0.4', status: 'active', color: 'accent-purple' },
                { name: 'Vite', version: 'v4.5.14', status: 'active', color: 'accent-orange' },
                { name: 'Tauri', version: 'v1.5.0', status: 'active', color: 'accent-red' }
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-quaternary/30 hover:bg-bg-quaternary/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-${tool.color}`} />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{tool.name}</p>
                      <p className="text-xs text-text-muted">{tool.version}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${tool.color}/20 text-${tool.color}`}>
                    {tool.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Chart temporarily disabled to fix white background */}
        {/* <motion.div 
          className="mt-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Epic3DChart
            data={chartData}
            title="Real-Time Performance Metrics"
            color="#00BFFF"
          />
        </motion.div> */}

        {/* Epic Timeline */}
        <motion.div 
          className="mt-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <EpicTimeline
            items={timelineData}
            title="Development Timeline"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default V3Ultimate;