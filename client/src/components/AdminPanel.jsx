// AdminPanel.js
import React, { useEffect } from 'react';
import Dashboard from './panel/Dashboard';

const AdminPanel = () => {
  useEffect(() => {
    console.log('AdminPanel montado');
    // Otras verificaciones o lógica aquí
  }, []);

  return (
    <div>
      <Dashboard/>
    </div>
  );
};

export default AdminPanel;
