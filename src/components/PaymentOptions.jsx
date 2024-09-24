import { useState } from 'react';

function PaymentOptions() {
  const [showOptions, setShowOptions] = useState(false);  // State to toggle payment options

  const handleToggle = () => {
    setShowOptions(!showOptions);  // Toggle visibility of payment options
  };

  const handlePayment = (event) => {
    event.preventDefault();
    alert('Proceeding to payment!');
  };

  return (
    <div className="payment-options">
      <h2>Payment</h2>
      
      {/* Button to toggle payment options */}
      <button onClick={handleToggle} className="payment-toggle-btn">
        {showOptions ? 'Hide Payment Options' : 'Show Payment Options'}
      </button>

      {/* Conditionally show payment options based on state */}
      {showOptions && (
        <form onSubmit={handlePayment} className="payment-form">
          <label>
            <input type="radio" name="payment" value="Credit Card" />
            Credit Card
          </label>
          <label>
            <input type="radio" name="payment" value="PayPal" />
            PayPal
          </label>
          <label>
            <input type="radio" name="payment" value="Bank Transfer" />
            Bank Transfer
          </label>
          <button type="submit">Proceed to Pay</button>
        </form>
      )}
    </div>
  );
}

export default PaymentOptions;
