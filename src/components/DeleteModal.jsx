import React, { useState } from 'react';
import { firestore } from './firebaseConfig'; // Adjust the path to your Firebase configuration
import { doc, getDocs, query, where, collection, deleteDoc } from 'firebase/firestore';
import './Modal.css';

const DeleteModal = ({ onClose, onDelete }) => {
  const [meterNumber, setMeterNumber] = useState('');

  const handleDeleteClick = async () => {
    if (!meterNumber) {
      alert('Please enter a water meter number.');
      return;
    }

    try {
      let userDocId = null;

      // Check and delete from Users collection
      const usersQuery = query(collection(firestore, 'Users'), where('meterNumber', '==', meterNumber));
      const userSnapshot = await getDocs(usersQuery);

      if (!userSnapshot.empty) {
        userDocId = userSnapshot.docs[0].id; // Assume meter number is unique
        await deleteDoc(doc(firestore, 'Users', userDocId));
        console.log(`Deleted user with meter number: ${meterNumber}`);
      } else {
        console.log(`No user found with meter number: ${meterNumber}`);
      }

      // Check and delete from clients/Clients_December/Clients subcollection
      const clientsQuery = query(
        collection(firestore, 'clients/Clients_December/Clients'),
        where('meterNumber', '==', meterNumber)
      );
      const clientSnapshot = await getDocs(clientsQuery);

      if (!clientSnapshot.empty) {
        const clientDocId = clientSnapshot.docs[0].id; // Assume meter number is unique
        await deleteDoc(doc(firestore, 'clients/Clients_December/Clients', clientDocId));
        console.log(`Deleted client with meter number: ${meterNumber}`);
      } else {
        console.log(`No client found with meter number: ${meterNumber}`);
      }

      if (userDocId) {
        alert('Client successfully deleted from both collections.');
      } else {
        alert('Client not found.');
      }
      onDelete(); // Call the onDelete callback if needed
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete the client. Please try again.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content2">
        <h2>Delete Client</h2>
        <input
          type="text"
          placeholder="Enter client Water Meter"
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
        />
        <div className="modal-actions">
          <button className="delete-btn" onClick={handleDeleteClick}>
            Delete
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
