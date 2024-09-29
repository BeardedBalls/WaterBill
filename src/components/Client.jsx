import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig'; 
import ClientTable from './clientTable'; 

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Client = () => {
  const [clients, setClients] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]); // Default to current month
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Reset loading state
      setError(''); // Clear previous errors
      try {
        const querySnapshot = await getDocs(collection(firestore, `clients/Clients_${selectedMonth}/Clients`));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]); // Refetch clients whenever the month changes

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    console.log('Selected month changed to:', e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <label htmlFor="month-select">Select Month: </label>
      <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      <ClientTable clients={clients} selectedMonth={selectedMonth} />
    </div>
  );
};

export default Client;
