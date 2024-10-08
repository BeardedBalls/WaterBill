import React, { useState } from 'react';
import './UpdateReadingModal.css'; // CSS file for the modal styling

const UpdateReadingModal = ({ client, onClose, onSave }) => {
  const [latestReading, setLatestReading] = useState(client.latestReading || '');

  const handleSave = () => {
    onSave(latestReading); // Save the updated latest reading
    onClose(); // Close the modal after saving
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Reading for {client.lastName} {client.firstName}</h2>
        <div className="modal-field">
          <label>Previous Reading:</label>
          <span>{client.previousReading}</span>
        </div>
        <div className="modal-field">
          <label>Latest Reading:</label>
          <input
            type="text"
            value={latestReading}
            onChange={(e) => setLatestReading(e.target.value)}
            placeholder="Enter latest reading"
          />
        </div>
        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateReadingModal;
