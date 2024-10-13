import React, { useState, useEffect } from 'react';
import UpdateReadingModal from './UpdateReadingModal'; // Import your modal component
import BillingModal from './BillingModal'; // Import billing modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import './clientTable.css';

const ClientTable = ({ clients, selectedMonth, onUpdateReading }) => {
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedClients, setSortedClients] = useState(clients);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for update modal visibility
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false); // State for billing modal visibility
    const [selectedClient, setSelectedClient] = useState(null); // Store selected client data

    useEffect(() => {
        setSortedClients(clients); // Update sorted clients when clients prop changes
    }, [clients]);

    const handleSort = () => {
        const sorted = [...sortedClients].sort((a, b) => {
            const nameA = a.lastName.toUpperCase();
            const nameB = b.lastName.toUpperCase();
            return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        setSortedClients(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleUpdateReadingClick = (client) => {
        setSelectedClient(client); // Set the client for the modal
        setIsUpdateModalOpen(true); // Open the Update modal
    };

    const handleBillingClick = (client) => {
        setSelectedClient(client); // Set the client for the modal
        setIsBillingModalOpen(true); // Open the Billing modal
    };

    const handleUpdate = (updatedClient) => {
        // Update the client list with the updated cubic reading, amount, and latest reading
        setSortedClients(prevClients =>
            prevClients.map(client => 
                client.id === updatedClient.id ? { 
                    ...client, 
                    cubic: updatedClient.cubic, 
                    amount: updatedClient.amount, // Ensure amount is updated
                    latestReading: updatedClient.latestReading // Ensure latest reading is updated correctly
                } : client
            )
        );
        onUpdateReading(updatedClient); // Callback to update parent component if needed
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Meter No.</th>
                        <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                            Last Name {sortDirection === 'asc' ? '▲' : '▼'}
                        </th>
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
                    {sortedClients.map(client => (
                        <tr key={client.id}>
                            <td>{client.meterNumber}</td>
                            <td>{client.lastName} {client.firstName}</td>
                            <td>{client.previousReading || '0'}</td>
                            <td>{client.latestReading || '0'}</td>
                            <td>{client.cubic || ''}</td>
                            <td>{client.amount || ''}</td> {/* Ensure amount is displayed */}
                            <td>{client.arrears || ''}</td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateReadingClick(client)} // Trigger Update modal
                                    className="icon-button"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                    <span className="tooltip-text">Update</span>
                                </button>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => handleBillingClick(client)} // Trigger Billing modal
                                    className="icon-button"
                                >
                                    <FontAwesomeIcon icon={faFileInvoice} />
                                    <span className="tooltip-text">Bill</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isUpdateModalOpen && (
                <UpdateReadingModal
                    client={selectedClient}
                    onClose={() => setIsUpdateModalOpen(false)} // Close modal handler
                    onSave={handleUpdate} // Pass handleUpdate to save changes
                    selectedMonth={selectedMonth} // Pass the selected month
                />
            )}

            {/* Render BillingModal when open */}
            {isBillingModalOpen && (
                <BillingModal
                    client={selectedClient}
                    onClose={() => setIsBillingModalOpen(false)} // Close modal handler
                />
            )}
        </div>
    );
};

export default ClientTable;
