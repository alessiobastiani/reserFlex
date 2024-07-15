import React, { useState, useEffect } from 'react';

const CurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: '20px', marginTop: '100px' }}>
      <h2 style={{ marginBottom: '10px', marginTop: '0px' }}>Fecha y hora actual:</h2>
      <p style={{ marginBottom: '0px', marginTop: '0px' }}>{currentDateTime.toLocaleString()}</p>
    </div>
  );
};

export default CurrentDateTime;
