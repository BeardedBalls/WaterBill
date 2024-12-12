import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import './PaymentModal.css';

const PaymentModal = ({ user, onClose, onPaymentSaved }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const clientsQuery = query(
          collection(firestore, `clients/Clients_${getMonthName(selectedMonth)}/Clients`),
          where('meterNumber', '==', user.meterNumber)
        );

        const querySnapshot = await getDocs(clientsQuery);
        let amount = 0;

        querySnapshot.forEach((doc) => {
          amount = doc.data().amount;
        });

        setTotalAmount(amount);
      } catch (error) {
        console.error('Error fetching total amount: ', error);
      }
    };

    fetchTotalAmount();
  }, [user.meterNumber, selectedMonth]);

  const handlePaymentChange = (e) => {
    setPaymentAmount(e.target.value);
    setError('');
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const getMonthName = (month) => {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  const handleSavePayment = async () => {
    setError('');

    if (paymentAmount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    setLoading(true);

    try {
      const paymentsQuery = query(
        collection(firestore, 'Payments', `Payment_${getMonthName(selectedMonth)}`, 'Payments'),
        where('meterNumber', '==', user.meterNumber)
      );

      const querySnapshot = await getDocs(paymentsQuery);

      if (!querySnapshot.empty) {
        setError('Payment has already been made for this month.');
        setLoading(false);
        return;
      }

      const paymentData = {
        userId: user.id,
        amount: Number(paymentAmount),
        name: `${user.firstName} ${user.lastName}`,
        month: selectedMonth,
        meterNumber: user.meterNumber, // Include this for validation
      };

      console.log('Saving payment data:', paymentData);

      // Create a reference to the Payments collection and the specific document for the month
      const paymentDocRef = collection(
        firestore,
        'Payments',
        `Payment_${getMonthName(selectedMonth)}`,
        'Payments'
      );

      // Add payment to Firestore
      await addDoc(paymentDocRef, paymentData);

      console.log('Payment saved successfully');

      onPaymentSaved();
      onClose();
    } catch (error) {
      console.error('Error saving payment: ', error);
      setError('Failed to save payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Payment for {user.firstName} {user.lastName}</h3>

        <label>
          Select Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {[...Array(12)].map((_, index) => (
              <option key={index} value={index + 1}>
                {new Date(0, index).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </label>

        <p>Total Amount to Pay: {totalAmount}</p>
        <input
          type="number"
          value={paymentAmount}
          onChange={handlePaymentChange}
          placeholder="Enter payment amount"
          disabled={loading} // Disable input while loading
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSavePayment} disabled={loading}>
          {loading ? 'Saving...' : 'Save Payment'}
        </button>
        <button onClick={onClose} disabled={loading}>Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;
