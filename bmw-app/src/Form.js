import React, { useState } from 'react';
import './App.css';

const RegistrationForm = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name, last_name, email, password, date_of_birth }),
      });
      const data = await response.json();
      if (data.success) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setDateOfBirth('');
        setSubmitted(true);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="form-wrapper">
        <div className="form-container">
            <img src="/bmw-logo.png" alt="BMW Logo" className="bmw-logo" />
          <h1>Registration Form</h1>
          {submitted && <div className="success">Registration successful!</div>}
          {error && <div className="error">An error occurred. Please try again.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                First Name:
                <input
                  className="form-input"
                  type="text"
                  name="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Last Name:
                <input
                  className="form-input"
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Email:
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Password:
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Date of Birth:
                <input
                  className="form-input"
                  type="date"
                  value={date_of_birth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </label>
            </div>
            <button className="form-button" type="submit">Register</button>
          </form>
        </div>
    </div>
  );  
};

export default RegistrationForm;
