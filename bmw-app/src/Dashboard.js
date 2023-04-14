import { AuthContext } from './App';
import React, { useContext } from 'react';
import './BMWStyle.css';
import GlucoseMonitoring from './BloodGlucoseLevels';
import GlucoseHistory from './GlucoseHistory';
import Navbar from './Navbar';
import DashboardSection from './DashboardSection'; // import the component
import { Routes, Route } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<DashboardSection />} /> {/* use the component */}
          <Route path="/blood-glucose-levels" element={<GlucoseMonitoring />} />
          <Route path="/glucose-history" element={<GlucoseHistory />} />
          <Route path="/geo-medical-assistance">
            {/* add the component for the Geo Medical Assistance section */}
          </Route>
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
