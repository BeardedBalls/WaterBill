import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import UserReceiptModal from './UserReceiptModal'; // Import the UserReceiptModal component
import './Receipt.css';

const Reciept = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'Users'));
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewBilling = (user) => {
    setSelectedUser(user);
    setIsReceiptOpen(true); // Open the receipt modal
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedUser(null); // Clear selected user
  };

  return (
    <div className="receipt-container">
      <h2>Receipt Page</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <li key={user.id} className="user-item">
                <span>{user.firstName} {user.lastName}</span>
                <button className="view-billing-btn" onClick={() => handleViewBilling(user)}>View Receipt</button>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      )}

      {/* Show receipt modal if a user is selected */}
      {isReceiptOpen && selectedUser && (
        <UserReceiptModal user={selectedUser} onClose={closeReceipt} />
      )}
    </div>
  );
};

export default Reciept;
