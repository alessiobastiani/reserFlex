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
    <div>
      <h2>Fecha y hora actual:</h2>
      <p>{currentDateTime.toLocaleString()}</p>
    </div>
  );
};

export default CurrentDateTime;
