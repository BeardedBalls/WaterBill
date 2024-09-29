import './UserApp.css';
import UserDetails from './UserDetails';
import PaymentOptions from './PaymentOptions';
import { useNavigate } from 'react-router-dom';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 


function UserApp() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signOut(auth); // Sign out the user from Firebase
      navigate('/'); // Redirect to login page after signing out
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error (e.g., show a message to the user)
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <div className="user-section">
        <UserDetails />
      </div>
      <div className="payment-section">
        <PaymentOptions />
      </div>
      <button id='logout' onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserApp;
