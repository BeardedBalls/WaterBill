import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import ClientTable from './clientTable';
import SendModal from './SendModal';
import AddModal from './AddModal';
import DeleteModal from './DeleteModal';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Client = () => {
  const [clients, setClients] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]); // Default to current month
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchClients = async (month) => {
    const querySnapshot = await getDocs(collection(firestore, `clients/Clients_${month}/Clients`));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const currentClients = await fetchClients(selectedMonth);
        setClients(currentClients);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <label htmlFor="month-select">Select Month: </label>
          <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={() => setIsSendModalOpen(true)}>SEND</button>
          <button onClick={() => setIsAddModalOpen(true)}>ADD</button>
          <button onClick={() => setIsDeleteModalOpen(true)}>DELETE</button>
        </div>
      </div>

      {/* Modals */}
      {isSendModalOpen && (
        <SendModal
          onClose={() => setIsSendModalOpen(false)}
          onSend={(monthIndex) => {
            console.log(`Send data for month index: ${monthIndex}`);
            setIsSendModalOpen(false);
          }}
        />
      )}
      {isAddModalOpen && (
        <AddModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(clientName) => {
            console.log(`Add client: ${clientName}`);
            setIsAddModalOpen(false);
          }}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={(clientId) => {
            console.log(`Delete client with ID: ${clientId}`);
            setIsDeleteModalOpen(false);
          }}
        />
      )}

      {/* Client Table Section */}
      <ClientTable clients={clients} selectedMonth={selectedMonth} />
    </div>
  );
};

export default Client;
