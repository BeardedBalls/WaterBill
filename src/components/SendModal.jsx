import React, { useState } from 'react';
import './SendModal.css';

const SendModal = ({ onClose, onSend }) => {
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSendClick = () => {
    if (selectedMonth) {
      onSend(selectedMonth);
    } else {
      alert('Please select a month before sending.');
    }
  };

  return (
    <div className="send-modal">
      <div className="modal-content">
        <h3>Select Month to Send</h3>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="" disabled>Select a month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <div className="modal-actions">
          <button className="send-btn" onClick={handleSendClick}>Send</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SendModal;