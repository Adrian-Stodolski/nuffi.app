
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import WorkspaceHub from './pages/WorkspaceHub';
import CreateWorkspace from './pages/CreateWorkspace';
import Marketplace from './pages/Marketplace';
import AICenter from './pages/AICenter';
import Community from './pages/Community';
import SystemScanner from './pages/SystemScanner.tsx';
import Settings from './pages/Settings';
import V3Ultimate from './pages/V3Ultimate';
import WowFactorDemo from './pages/WowFactorDemo';
import PowerMode from './pages/PowerMode';
import WorkflowDesigner from './pages/WorkflowDesigner';
import PresetWizard from './pages/PresetWizard';
import AIRecommendations from './pages/AIRecommendations';
import AnimatedBackground from './components/AnimatedBackground';

import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary text-white relative overflow-hidden">
        {/* Global V3Ultimate Background */}
        <AnimatedBackground />
        
        {/* Sidebar with integrated TopBar - Animated */}
        <motion.div 
          className="flex flex-col relative"
          animate={{ 
            width: sidebarCollapsed ? 80 : 256 
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut" 
          }}
        >
          {/* Top Bar - moved to sidebar area */}
          <TopBar onMenuToggle={handleMenuToggle} collapsed={sidebarCollapsed} />
          <Sidebar collapsed={sidebarCollapsed} />
        </motion.div>
        
        {/* Main Content - Animated to fill remaining space */}
        <motion.main 
          className="flex-1 h-full overflow-hidden relative z-10"
          animate={{ 
            marginLeft: sidebarCollapsed ? '0px' : '0px'
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut" 
          }}
        >
          {/* Page Content */}
          <motion.div 
            className="h-full overflow-auto"
            animate={{
              paddingLeft: sidebarCollapsed ? '1rem' : '1.5rem',
              paddingRight: sidebarCollapsed ? '1rem' : '1.5rem'
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut" 
            }}
          >
            <Routes>
              <Route path="/" element={<WorkspaceHub />} />
              <Route path="/create" element={<CreateWorkspace />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/ai-center" element={<AICenter />} />
              <Route path="/community" element={<Community />} />
              <Route path="/scanner" element={<SystemScanner />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/v3-ultimate" element={<V3Ultimate />} />
              <Route path="/wow-factor" element={<WowFactorDemo />} />
              <Route path="/ai-recommendations" element={<AIRecommendations />} />
              <Route path="/preset-wizard" element={<PresetWizard />} />
              <Route path="/power-mode" element={<PowerMode />} />
              <Route path="/workflow-designer" element={<WorkflowDesigner />} />
            </Routes>
          </motion.div>
        </motion.main>
      </div>



      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'rgba(15, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
          },
          success: {
            style: {
              border: '1px solid rgba(76, 175, 80, 0.3)',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(15, 15, 20, 0.95))',
              boxShadow: '0 20px 25px -5px rgba(76, 175, 80, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            },
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(15, 15, 20, 0.95))',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              border: '1px solid rgba(0, 191, 255, 0.3)',
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(15, 15, 20, 0.95))',
              boxShadow: '0 20px 25px -5px rgba(0, 191, 255, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            },
            iconTheme: {
              primary: '#00BFFF',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;