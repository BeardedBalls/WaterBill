import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './UserCount.css'

function UserCount() {
  const [userCount, setUserCount] = useState(0);
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const countRef = doc(db, 'metadata', 'userCount');
        const countDoc = await getDoc(countRef);

        if (countDoc.exists()) {
          setUserCount(countDoc.data().count || 0);
        } else {
          setUserCount(0); // Default if the document doesn't exist
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, [db]);

    return(
      <div className="user-count-container">
      <div className="user-count-label">Total clients</div>
      <div className="user-count-number">{userCount}</div>
      </div>
    )
}

export default UserCount;