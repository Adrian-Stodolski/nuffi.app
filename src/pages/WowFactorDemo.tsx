import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Server,
  Monitor,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

const WowFactorDemo: React.FC = () => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpu: { usage: 45, temp: 62, cores: 8 },
    memory: { used: 68, total: 16, available: 5.1 },
    disk: { usage: 32, read: 125, write: 89 },
    network: { download: 12.5, upload: 3.2, latency: 28 }
  });

  const [systemHealth, setSystemHealth] = useState({
    overall: 85,
    processes: 142,
    uptime: '2d 14h 32m',
    alerts: 2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          temp: Math.max(40, Math.min(80, prev.cpu.temp + (Math.random() - 0.5) * 5))
        },
        memory: {
          ...prev.memory,
          used: Math.max(20, Math.min(95, prev.memory.used + (Math.random() - 0.5) * 8))
        },
        disk: {
          ...prev.disk,
          usage: Math.max(10, Math.min(80, prev.disk.usage + (Math.random() - 0.5) * 3)),
          read: Math.max(0, Math.min(500, prev.disk.read + (Math.random() - 0.5) * 50)),
          write: Math.max(0, Math.min(300, prev.disk.write + (Math.random() - 0.5) * 30))
        },
        network: {
          ...prev.network,
          download: Math.max(0, Math.min(100, prev.network.download + (Math.random() - 0.5) * 20)),
          upload: Math.max(0, Math.min(50, prev.network.upload + (Math.random() - 0.5) * 10)),
          latency: Math.max(5, Math.min(100, prev.network.latency + (Math.random() - 0.5) * 15))
        }
      }));
    }, 2000);

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
              className="w-12 h-12 bg-gradient-to-br from-accent-orange to-accent-red rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(249, 115, 22, 0.4)",
                  "0 0 30px rgba(249, 115, 22, 0.6)",
                  "0 0 20px rgba(249, 115, 22, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Monitor className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-ai">Performance Monitor</h1>
              <p className="text-text-secondary">Real-time system performance monitoring</p>
            </div>
          </div>

          {/* System Health Overview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'System Health', value: `${systemHealth.overall}%`, icon: CheckCircle, color: 'accent-green' },
              { label: 'Active Processes', value: systemHealth.processes, icon: Activity, color: 'accent-blue' },
              { label: 'System Uptime', value: systemHealth.uptime, icon: Clock, color: 'accent-purple' },
              { label: 'Active Alerts', value: systemHealth.alerts, icon: AlertTriangle, color: 'accent-orange' }
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
                      Live
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

        {/* Performance Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* CPU Performance */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">CPU Performance</h2>
                <p className="text-text-secondary text-sm">{realTimeMetrics.cpu.cores} cores • {realTimeMetrics.cpu.temp}°C</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-ai mb-2">{realTimeMetrics.cpu.usage}%</div>
                <div className="w-full bg-bg-quaternary rounded-full h-3 mb-4">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${realTimeMetrics.cpu.usage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                  <div className="text-lg font-bold text-text-primary">{realTimeMetrics.cpu.temp}°C</div>
                  <div className="text-xs text-text-muted">Temperature</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                  <div className="text-lg font-bold text-text-primary">{realTimeMetrics.cpu.cores}</div>
                  <div className="text-xs text-text-muted">Cores</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Memory Usage */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Memory Usage</h2>
                <p className="text-text-secondary text-sm">{realTimeMetrics.memory.total}GB total • {realTimeMetrics.memory.available}GB available</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-ai mb-2">{realTimeMetrics.memory.used}%</div>
                <div className="w-full bg-bg-quaternary rounded-full h-3 mb-4">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-accent-green to-accent-blue rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${realTimeMetrics.memory.used}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                  <div className="text-lg font-bold text-text-primary">{((realTimeMetrics.memory.total * realTimeMetrics.memory.used) / 100).toFixed(1)}GB</div>
                  <div className="text-xs text-text-muted">Used</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                  <div className="text-lg font-bold text-text-primary">{realTimeMetrics.memory.available}GB</div>
                  <div className="text-xs text-text-muted">Available</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Disk I/O */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-red rounded-xl flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Disk I/O</h2>
                <p className="text-text-secondary text-sm">Read/Write operations per second</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient-ai mb-2">{realTimeMetrics.disk.usage}%</div>
                <div className="w-full bg-bg-quaternary rounded-full h-3 mb-4">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-accent-orange to-accent-red rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${realTimeMetrics.disk.usage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                  <div className="text-lg font-bold text-text-primary">{realTimeMetrics.disk.read} MB/s</div>
                  <div className="text-xs text-text-muted">Read Speed</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                  <div className="text-lg font-bold text-text-primary">{realTimeMetrics.disk.write} MB/s</div>
                  <div className="text-xs text-text-muted">Write Speed</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Network Activity */}
          <motion.div 
            className="glass-card"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Network Activity</h2>
                <p className="text-text-secondary text-sm">Real-time network usage • {realTimeMetrics.network.latency}ms latency</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-green mb-1">{realTimeMetrics.network.download} MB/s</div>
                  <div className="text-xs text-text-muted mb-2">Download</div>
                  <div className="w-full bg-bg-quaternary rounded-full h-2">
                    <motion.div
                      className="h-2 bg-accent-green rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(realTimeMetrics.network.download / 100) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-blue mb-1">{realTimeMetrics.network.upload} MB/s</div>
                  <div className="text-xs text-text-muted mb-2">Upload</div>
                  <div className="w-full bg-bg-quaternary rounded-full h-2">
                    <motion.div
                      className="h-2 bg-accent-blue rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(realTimeMetrics.network.upload / 50) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-bg-quaternary/30">
                <div className="text-lg font-bold text-text-primary">{realTimeMetrics.network.latency}ms</div>
                <div className="text-xs text-text-muted">Network Latency</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* System Processes */}
        <motion.div 
          className="mt-6 glass-card"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Top System Processes</h2>
              <p className="text-text-secondary text-sm">Most resource-intensive processes</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Nuffi Development', cpu: 15.2, memory: 8.4, status: 'active' },
              { name: 'VS Code', cpu: 12.8, memory: 6.2, status: 'active' },
              { name: 'Chrome Browser', cpu: 8.5, memory: 12.1, status: 'active' },
              { name: 'Node.js Server', cpu: 6.3, memory: 4.8, status: 'active' },
              { name: 'System Monitor', cpu: 3.1, memory: 2.2, status: 'active' }
            ].map((process, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-bg-quaternary/30 hover:bg-bg-quaternary/50 transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-accent-green" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{process.name}</p>
                    <p className="text-xs text-text-muted">Status: {process.status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-text-primary font-medium">{process.cpu}%</div>
                    <div className="text-text-muted text-xs">CPU</div>
                  </div>
                  <div className="text-center">
                    <div className="text-text-primary font-medium">{process.memory}%</div>
                    <div className="text-text-muted text-xs">Memory</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WowFactorDemo;