import React, { useState /*useEffect*/ } from 'react';
//import axios from 'axios';
import './BMWStyle.css';

function BloodGlucoseLevels() {
  const [glucoseData, setGlucoseData] = useState([
    { timestamp: '1', date: '2023-04-01', time: '08:00', value: 100 },
    { timestamp: '2', date: '2023-04-01', time: '12:00', value: 110 },
    { timestamp: '3', date: '2023-04-01', time: '18:00', value: 90 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  //useEffect(() => {
  //  const getGlucoseData = async () => {
  //    setIsLoading(true);
//
  //    try {
  //      const response = await axios.get('/api/user/1/glucose-data', {
  //        headers: {
  //          Authorization: `Bearer ${localStorage.getItem("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5MzdjMjBjNy0yOThlLTQzNzgtODhiYS0zOWVhOGQ1MzIwMDgiLCJhdWQiOiJodHRwczovL3NhbmRib3gtYXBpLmRleGNvbS5jb20iLCJzY29wZSI6WyJlZ3YiLCJjYWxpYnJhdGlvbiIsImRldmljZSIsImV2ZW50Iiwic3RhdGlzdGljcyIsIm9mZmxpbmVfYWNjZXNzIl0sImlzcyI6Imh0dHBzOi8vc2FuZGJveC1hcGkuZGV4Y29tLmNvbSIsImV4cCI6MTY4MDEyMjkwNywiaWF0IjoxNjgwMTE1NzA3LCJjbGllbnRfaWQiOiJMV2ttNDdHbFgxWnhGVXZzOWtacnpwY1JGbm55ZnE1eCJ9.fCiiyiXZHtfA7YnUrpoXsdD-KuzRqwtGfLAmCQRcLKpyEkEEqtDnyobYtrgpAd41ZQCkHeCZrZ9WyxccGURl3VNO6KwpH8H3eCE5BlVzADWn5qnMw34f-m91Bd7nl1bNhrvZUEyP09ieZvkElRQqkYRAzgz794Gk4ySP1hYoVKlnhNej7ew13IdapeRQga07z5ykIQNxSbix74YHM8iJ7g-DzWUSlPdKKljCXU5uhAU94yZvux6zBbHKDJU59_Ug5N3O0J7nl8vTgGuyFD4mfvqTRtheXvUz71Om1cFg5AIXaKTroCSIegQRuytyplUUCAW44mcLcz2CFRn7MIjKBg")}`,
  //        },
  //      });
//
  //      setGlucoseData(response.data);
  //    } catch (error) {
  //      console.error('Error:', error);
  //      setError('An error occurred while fetching glucose data.');
  //    }
//
  //    setIsLoading(false);
  //  };
//
  //  getGlucoseData();
  //}, []);

  return (
    <div className="container">
      <h1>Blood Glucose Levels</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (
        <>
          <div className="date-picker">
            {/* Date picker component goes here */}
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Glucose Level (mg/dL)</th>
              </tr>
            </thead>
            <tbody>
              {glucoseData.map((glucoseLevel) => (
                <tr key={glucoseLevel.timestamp}>
                  <td>{glucoseLevel.date}</td>
                  <td>{glucoseLevel.time}</td>
                  <td>{glucoseLevel.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default BloodGlucoseLevels;