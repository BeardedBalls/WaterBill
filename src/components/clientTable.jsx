import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import BillingModal from './BillingModal'; // Modal for the billing actions
import UpdateReadingModal from './UpdateReadingModal'; // Modal for updating reading
import './clientTable.css';

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const ClientTable = ({ clients, selectedMonth }) => {
  const [selectedClientForReading, setSelectedClientForReading] = useState(null); // Track client for updating reading
  const [selectedClientForBilling, setSelectedClientForBilling] = useState(null); // Track client for billing modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Track update reading modal state
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false); // Track billing modal state
  const [error, setError] = useState('');

  // Open the "Update Reading" modal
  const handleUpdateReadingClick = (client) => {
    setSelectedClientForReading(client);
    setIsUpdateModalOpen(true);
  };

  // Open the "Billing" modal (icon button)
  const handleBillingClick = (client) => {
    setSelectedClientForBilling(client);
    setIsBillingModalOpen(true);
  };

  // Close the modals
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedClientForReading(null);
  };

  const closeBillingModal = () => {
    setIsBillingModalOpen(false);
    setSelectedClientForBilling(null);
  };

  // Save the updated reading
  const saveUpdatedReading = (clientId, newLatestReading) => {
    const updatedClient = {
      ...clients.find(client => client.id === clientId),
      latestReading: newLatestReading,
    };

    const saveClient = debounce(async () => {
      try {
        const clientRef = doc(firestore, `clients/Clients_${selectedMonth}/Clients`, clientId);
        await updateDoc(clientRef, updatedClient);
        console.log('Client updated successfully');
      } catch (error) {
        console.error('Error updating client:', error);
        setError('Failed to update client');
      }
    }, 500);

    saveClient();
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Meter No.</th>
            <th>Name</th>
            <th>Previous Reading</th>
            <th>Latest Reading</th>
            <th>Cubic</th>
            <th>Amount</th>
            <th>Arrears</th>
            <th>Update Reading</th>
            <th>Other Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.meterNumber}</td>
              <td>{client.lastName} {client.firstName}</td>
              <td>{client.previousReading || '0'}</td>
              <td>{client.latestReading || '0'}</td>
              <td>{client.cubic || ''}</td>
              <td>{client.amount || ''}</td>
              <td>{client.arrears || ''}</td>
              <td>
                {/* Button to trigger "Update Reading" modal */}
                <button
                  type="button"
                  onClick={() => handleUpdateReadingClick(client)}
                >
                  Update
                </button>
              </td>
              <td>
                {/* Icon button for other billing modal */}
                <button
                  id="btn1"
                  type="button"
                  onClick={() => handleBillingClick(client)}
                >
                  Bill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Update Reading Modal */}
      {isUpdateModalOpen && selectedClientForReading && (
        <UpdateReadingModal
          client={selectedClientForReading}
          onClose={closeUpdateModal}
          onSave={(newLatestReading) => saveUpdatedReading(selectedClientForReading.id, newLatestReading)}
        />
      )}

      {/* Billing Modal */}
      {isBillingModalOpen && selectedClientForBilling && (
        <BillingModal client={selectedClientForBilling} onClose={closeBillingModal} />
      )}
    </div>
  );
};

export default ClientTable;
