import React, { useState } from 'react';
import { firestore } from './firebaseConfig'; // Adjust the import path as needed
import { setDoc, doc } from 'firebase/firestore';
import './AddModal.css'; // Import CSS for styling

const AddModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    address: '',
    phoneNumber: '',
    meterNumber: '',
    email: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = Math.random().toString(36).substr(2, 9); // Simulate unique ID
      // Save user data to Firestore
      await setDoc(doc(firestore, 'Users', userId), {
        ...formData,
      });

      // Save client document for January
      await setDoc(doc(firestore, 'clients/Clients_December/Clients', userId), {
        ...formData,
        latestReading: 0,
        previousReading: 0,
      });

      alert('Client added successfully!');
      onAdd(); // Callback to refresh the list in the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error(error);
      setError('Failed to add client. Please try again.');
    }
  };

  return (
    <div className="add-modal">
      <div className="add-modal-content">
        <h3>Add Client</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <div className="inputContainer">
            <label htmlFor="lastName" className="label">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="firstName" className="label">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="address" className="label">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="phoneNumber" className="label">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="meterNumber" className="label">Meter Number:</label>
            <input
              type="text"
              id="meterNumber"
              name="meterNumber"
              value={formData.meterNumber}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="email" className="label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="close-btn">Cancel</button>
            <button type="submit" className="add-btn">Add Client</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
