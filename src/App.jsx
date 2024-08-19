// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidePanel from './components/SidePanel';
import Dashboard from './components/Dashboard';
import Client from './components/Client';
import Billing from './components/Billing';
import Profile from './components/Profile';

const App = () => (
  <Router>
    <div style={{ display: 'flex' }}>
      <SidePanel />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
        <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/client" element={<Client />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/" element={<Dashboard />} /> {/* Default route */}
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
