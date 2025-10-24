
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

import './App.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
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
            {/* Placeholder routes for AI features */}
            <Route path="/ai-recommendations" element={<div className="p-6 bg-gray-900 text-white h-full"><h1>AI Recommendations - Coming Soon</h1></div>} />
            <Route path="/preset-wizard" element={<div className="p-6 bg-gray-900 text-white h-full"><h1>Preset Wizard - Coming Soon</h1></div>} />
            <Route path="/power-mode" element={<div className="p-6 bg-gray-900 text-white h-full"><h1>Power Mode - Coming Soon</h1></div>} />
            <Route path="/workflow-designer" element={<div className="p-6 bg-gray-900 text-white h-full"><h1>Workflow Designer - Coming Soon</h1></div>} />
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