import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='homepage'>
      <h1>Welcome to the Homepage!</h1>
      <button className='logout-button' onClick={handleLogout}>Logi välja</button>
    </div>
  );
};

export default Homepage;