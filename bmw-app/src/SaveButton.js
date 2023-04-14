import React from 'react';

function SaveButton() {
  const handleButtonClick = async () => {
    const data = { notes: 'Clever doesnt have diabetes' };

    const response = await fetch('http://localhost:5000/api/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('Data saved successfully');
    } else {
      console.error('Error saving data', response.statusText);
    }
  };

  return (
    <div>
      <h2>Save Data Page</h2>
      <button onClick={handleButtonClick}>Save Data</button>
    </div>
  );
}

export default SaveButton;
