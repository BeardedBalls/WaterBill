
import './UserApp.css';
import UserDetails from './UserDetails';
import PaymentOptions from './PaymentOptions';

function UserApp() {
  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <main>
        <section className="user-section">
          <UserDetails />
        </section>
        <section className="payment-section">
          <PaymentOptions />
        </section>
      </main>
    </div>
  );
}

export default UserApp;
