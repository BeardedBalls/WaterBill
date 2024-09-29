import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import BillingModal from './BillingModal'; // Modal Component to show Billing


const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const ClientTable = ({ clients, selectedMonth }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null); // Track selected client for billing modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const navigate = useNavigate();

  const handleInputChange = (clientId, e) => {
    const { name, value } = e.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [clientId]: {
        ...prevFormData[clientId],
        [name]: value
      }
    }));

    const updatedClient = {
      ...clients.find(client => client.id === clientId),
      [name]: value
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

  const handleBillingClick = (client) => {
    setSelectedClient(client); // Set the selected client for billing
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.meterNumber}</td>
              <td>{client.lastName} {client.firstName}</td>
              <td>{client.previousReading || ''}</td>
              <td>{client.latestReading || ''}</td>
              <td>{client.cubic || ''}</td>
              <td>{client.amount || ''}</td>
              <td>{client.arrears || ''}</td>
              <td>
                <input
                  type="text"
                  name="latestReading"
                  value={formData[client.id]?.latestReading ?? client.latestReading ?? ''}
                  onChange={(e) => handleInputChange(client.id, e)}
                  placeholder="Enter new reading"
                />
              </td>
              <td>
                <button type="button" onClick={() => handleBillingClick(client)}>icon</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Billing Modal */}
      {isModalOpen && selectedClient && (
        <BillingModal client={selectedClient} onClose={closeModal} />
      )}
    </div>
  );
};

export default ClientTable;
