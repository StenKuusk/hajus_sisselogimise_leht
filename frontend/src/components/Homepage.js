import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Kustutame tokeni
    navigate('/login'); // Suuname tagasi logimislehele
  };

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <button onClick={handleLogout}>Logi välja</button> {/* Logout nupp */}
    </div>
  );
};

export default Homepage;