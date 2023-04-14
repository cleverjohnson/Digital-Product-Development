import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SaveButton from './SaveButton';
import RegistrationForm from './Form';
import Login from './LoginForm';
import BloodGlucoseLevels from './BloodGlucoseLevels';
import GlucoseHistory from './GlucoseHistory';
import Dashboard from './Dashboard';
import GeoMedicalAssistance from "./GeoMedicalAssistance";

export const AuthContext = createContext();

function App() {
  //const handleAuthorizeClick = () => {
   // window.location.href = `https://api.dexcom.com/v2/oauth2/login?client_id=LWkm47GlX1ZxFUvs9kZrzpcRFnnyfq5x&redirect_uri=http://localhost:5000/callback&response_type=code&scope=offline_access`;
 // };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} exact />
            <Route path="/Form" element={<RegistrationForm />} />
            <Route path="/blood-glucose-levels" element={<BloodGlucoseLevels />} />
            <Route path="/glucose-history" element={<GlucoseHistory />} />
            <Route path="/geo-medical-assistance" element={<GeoMedicalAssistance />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/save-button" element={<SaveButton />} />
          </Routes>
          {/*<button onClick={handleAuthorizeClick}>Log in with Dexcom</button>*/}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
