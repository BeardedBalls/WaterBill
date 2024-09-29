

function UserDetails() {
  const user = {
    name: 'John Doe',
    email: 'sample',
    balance: '200.00',
  };

  return (
    <div className="user-details">
      <h2>User Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Balance:</strong> {user.balance}</p>
    </div>
  );
}

export default UserDetails;
