// LoginForm.js
import React, { useContext, useState } from 'react';
import { AuthContext } from './App';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';

const LoginForm = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setEmail('');
        setPassword('');
        setSubmitted(true);
        setError(false);
        setIsAuthenticated(true);
        navigate('/dashboard');
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
        <h1>Login</h1>
        {submitted && <div className="success">Login successful!</div>}
        {error && <div className="error">An error occurred. Please try again.</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Email:
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </label>
          </div>
          <button className="form-button" type="submit">Login</button>
          <p>Don't have an account? <Link to="/Form">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;