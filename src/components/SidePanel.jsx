// SidePanel.js
import React from 'react';
import { Link } from 'react-router-dom';

function SidePanel(){
  return(    
    <div style={{ width: '200px', height: '100vh', background: '#f0f0f0', padding: '10px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
      <Link to="/profile">
        <button style={{ width: '100%', padding: '10px', marginBottom: '5px' }}>Profile</button>
      </Link>
      <Link to="/dashboard">
        <button style={{ width: '100%', padding: '10px', marginBottom: '5px' }}>Dashboard</button>
      </Link>
      <Link to="/client">
        <button style={{ width: '100%', padding: '10px', marginBottom: '5px' }}>Client</button>
      </Link>
      <Link to="/billing">
        <button style={{ width: '100%', padding: '10px' }}>Billing</button>
      </Link>
    </div>
  )
}
export default SidePanel;
