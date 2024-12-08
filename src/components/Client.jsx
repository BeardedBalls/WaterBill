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

    const handleUpdateReading = async (updatedClient) => {
        const monthIndex = months.indexOf(selectedMonth);

        // Update the current month's client with the new latest reading
        const updatedClients = clients.map(client => 
            client.id === updatedClient.id ? { ...client, latestReading: updatedClient.latestReading, cubic: updatedClient.cubic } : client
        );

        setClients(updatedClients);

        // If the selected month is not January, move latest reading to next month
        if (monthIndex < 11) { // Ensure it doesn't exceed December
            const nextMonth = months[monthIndex + 1];
            const nextClientDoc = doc(firestore, `clients/Clients_${nextMonth}/Clients`, updatedClient.id);

            // Update the next month with the latest reading as previous reading and reset values for current month
            await setDoc(nextClientDoc, {
                previousReading: updatedClient.latestReading, // Set the current latest reading as the previous reading for the next month
                latestReading: 0, // Reset latest reading for current month
                cubic: 0, // Reset cubic for current month
                amount: 0 // Reset amount for current month
            }, { merge: true }); // Use merge to update only the fields provided
        }
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
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        width: '400px',
                        textAlign: 'center'
                    }}>
                        <h2>Send Confirmation</h2>
                        <p>Are you sure you want to send the data?</p>
                        <button onClick={toggleModal} style={{
                            marginRight: '10px',
                            backgroundColor: '#f44336',
                            color: 'black',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>Cancel</button>
                        <button style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>Confirm</button>
                    </div>
                </div>
            )}

            {/* Client Table Section */}
            <ClientTable clients={clients} selectedMonth={selectedMonth} onUpdateReading={handleUpdateReading} />
        </div>
    );
};

export default Client;
