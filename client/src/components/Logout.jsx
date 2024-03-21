import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    // Redirige al usuario a la página de inicio de sesión u otra página relevante
    window.location.href = '/';
  };

  return (
    <button className='btn btn-dark ' onClick={handleLogout}>Cerrar sesión</button>
  );
};

export default Logout;