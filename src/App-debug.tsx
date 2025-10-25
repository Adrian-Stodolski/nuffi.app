import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  console.log('🚀 NUFFI App is rendering - DEBUG VERSION');

  return (
    <Router>
      <div className="flex h-screen bg-red-500 text-white">
        <div className="p-4">
          <h1>DEBUG: App is working!</h1>
          <p>If you see this, the basic structure works.</p>
        </div>
      </div>
    </Router>
  );
}

export default App;