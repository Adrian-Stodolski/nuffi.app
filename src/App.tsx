
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
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
  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary text-white relative overflow-hidden">
        {/* Global V3Ultimate Background */}
        <AnimatedBackground />
        
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative z-10">
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
        </main>
      </div>



      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111113',
            color: '#ffffff',
            border: '1px solid #2a2a2e',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          },
          success: {
            style: {
              borderLeft: '4px solid #22c55e',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;