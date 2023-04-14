import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BMWStyle.css';

function GlucoseHistory() {
  const [glucoseHistory, setGlucoseHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/user/1/glucose-history');
        setGlucoseHistory(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Glucose History</h1>
      <table>
        <thead>
          <tr>
            <th>Glucose Level</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {glucoseHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.glucose_level}</td>
              <td>{new Date(item.date_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GlucoseHistory;
