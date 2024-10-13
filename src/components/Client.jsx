import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
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
      setLoading(true); 
      setError('');
      try {
        const querySnapshot = await getDocs(collection(firestore, `clients/Clients_${selectedMonth}/Clients`));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(data);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    console.log('Selected month changed to:', month);

    if (month !== 'January') {
      try {
        const previousMonth = months[months.indexOf(month) - 1];
        console.log('Fetching data for previous month:', previousMonth); // Debug log
        
        const previousClientsSnapshot = await getDocs(collection(firestore, `clients/Clients_${previousMonth}/Clients`));
        
        // Check if previous clients data exists
        if (previousClientsSnapshot.empty) {
          console.log(`No clients found for ${previousMonth}.`); // Debug log
          return; // Exit if no data found
        }

        const previousClientsData = previousClientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(`Previous Clients Data for ${previousMonth}:`, previousClientsData); // Debug log

        await Promise.all(previousClientsData.map(async (prevClient) => {
          const latestReading = prevClient.latestReading || 0; // Get latest reading or default to 0
          
          // Use the previous month's latest reading for the current month
          const previousReading = latestReading;

          // Calculate the amount based on latestReading from January
          let amount = null; // Initialize amount as null
          if (latestReading > 0) { // Only compute amount if latestReading is greater than 0
            if (latestReading <= 10) {
              amount = 400;
            } else {
              amount = latestReading * 0.1247 + 400;
            }
          }

          const newClientData = {
            firstName: prevClient.firstName,
            lastName: prevClient.lastName,
            meterNumber: prevClient.meterNumber,
            previousReading: previousReading, // Set previous reading to latest reading of January
            latestReading: 0, // Latest reading for February is the same as January
            amount: amount || 0 // Set calculated amount or default to 0
          };

          console.log(`Saving client data for ${month}:`, newClientData); // Debug log

          // Save new client data for the selected month
          await setDoc(doc(firestore, `clients/Clients_${month}/Clients`, prevClient.id), newClientData);
        }));
      } catch (error) {
        console.error('Error fetching or saving data:', error);
      }
    }
  };

  const handleUpdateReading = (updatedClient) => {
    // Update the client state with the updated readings
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === updatedClient.id ? { ...client, cubic: updatedClient.cubic, latestReading: updatedClient.latestReading } : client
      )
    );
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

      <ClientTable clients={clients} selectedMonth={selectedMonth} onUpdateReading={handleUpdateReading} />
    </div>
  );
};

export default Client;
