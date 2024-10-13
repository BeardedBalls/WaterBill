import React, { useState } from 'react';
import './UpdateReadingModal.css'; // CSS file for the modal styling
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig'; // Ensure this path is correct

const UpdateReadingModal = ({ client, onClose, onSave, selectedMonth }) => {
    const [latestReading, setLatestReading] = useState(client.latestReading || '');

    const handleSave = async () => {
        const previousReading = Number(client.previousReading) || 0;
        const latest = Number(latestReading) || 0;
        const cubic = latest - previousReading;

        // Calculate amount based on cubic consumption
        let amount = 0;
        if (cubic <= 10) {
            amount = 400; // Fixed amount if cubic is less than or equal to 10
        } else {
            amount = 400 + ((cubic - 10) * 12.47); // 12.47 for each cubic above 10
        }

        // Use the selected month directly
        const month = selectedMonth || new Date().toLocaleString('default', { month: 'long' });
        console.log('Updating reading for month:', month, 'Client ID:', client.id);

        try {
            const clientRef = doc(firestore, `clients/Clients_${month}/Clients`, client.id);
            await updateDoc(clientRef, {
                latestReading: latest,
                cubic: cubic,
                amount: amount // Include the computed amount
            });

            console.log(`Updated client ${client.id}:`, { latest, cubic, amount });
            onSave({ id: client.id, cubic, amount, latestReading: latest }); // Pass the latest reading as well
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error('Error updating reading:', error);
            alert('Failed to update reading. Error: ' + error.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Update Reading for {client.lastName} {client.firstName}</h2>
                <div className="modal-field">
                    <label>Previous Reading:</label>
                    <span>{client.previousReading}</span>
                </div>
                <div className="modal-field">
                    <label>Latest Reading:</label>
                    <input
                        type="text"
                        value={latestReading}
                        onChange={(e) => setLatestReading(e.target.value)}
                        placeholder="Enter latest reading"
                    />
                </div>
                <div className="modal-actions">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateReadingModal;
