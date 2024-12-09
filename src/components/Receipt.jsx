import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import ClientTable from './clientTable';
import SendModal from './SendModal';


const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Client = () => {
  const [clients, setClients] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]); // Default to current month
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const fetchClients = async (month) => {
    const querySnapshot = await getDocs(collection(firestore, `clients/Clients_${month}/Clients`));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <button onClick={toggleModal} style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          SEND
        </button>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <SendModal
          onClose={toggleModal}
          onSend={(monthIndex) => {
            console.log(`Send data for month index: ${monthIndex}`);
            toggleModal();
          }}
        />
      )}

      {/* Client Table Section */}
      <ClientTable clients={clients} selectedMonth={selectedMonth} />
    </div>
  );
};

export default Client;
