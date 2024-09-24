import React, { useState } from 'react';
import { auth, firestore } from './firebaseConfig'; // Adjust import path as needed
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName:'',
    address: '',
    phoneNumber: '',
    meterNumber: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        lastName: formData.lastName,
        firstName: formData.firstName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        meterNumber: formData.meterNumber,
        email: formData.email,
      });
      await setDoc(doc(firestore, 'clients/Clients_January/Clients', user.uid), {
        lastName: formData.lastName,
        firstName: formData.firstName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        meterNumber: formData.meterNumber,
        email: formData.email,
      });

      // Redirect to login page and show success alert
      alert('Registration successful!');
      navigate('/'); // Redirect to login page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="header">Register</h2>

        {error && <p className="error">{error}</p>}

        <div className="inputGroup">
          <div className="inputContainer">
            <label htmlFor="lastName" className="label">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="firstName" className="label">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        <div className="inputContainer">
          <label htmlFor="address" className="label">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="phoneNumber" className="label">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="meterNumber" className="label">Meter Number:</label>
          <input
            type="text"
            id="meterNumber"
            name="meterNumber"
            value={formData.meterNumber}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="email" className="label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="password" className="label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="repeatPassword" className="label">Repeat Password:</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">Register</button>
        <a
              href="#"
              className="forgot-password-link"
              onClick={(e) => {
                navigate('/')
              }}
            >
              Back to Login
            </a>
      </form>
    </div>
  );
};

export default Register;
