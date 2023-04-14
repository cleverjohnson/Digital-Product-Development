// Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import bmwLogo from './bmw-logo.png';

function Navbar() {
  return (
    <div className="navbar-container">
        <div className="logo-container">
          <img src={bmwLogo} alt="BMW Logo" className="bmw-logo" />
        </div>
        <nav>
          <ul className="navbar-list">
            <li className="navbar-item">
              <NavLink to="/dashboard" activeClassName="active-link">
                Dashboard
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/blood-glucose-levels" activeClassName="active-link">
                Blood Glucose Levels
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/glucose-history" activeClassName="active-link">
                Glucose History
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/geo-medical-assistance" activeClassName="active-link">
                Geo Medical Assistance
              </NavLink>
            </li>
          </ul>
        </nav>
    </div>
  );
}

export default Navbar;
