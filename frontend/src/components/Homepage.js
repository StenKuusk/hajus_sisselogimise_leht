import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToSolitaire = () => {
    navigate('/solitaire');
  };


  return (
    <div className='homepage'>
      <h1>Welcome to the Homepage!</h1>
      <button className='solitaire-button' onClick={goToSolitaire}>Play Solitaire</button>
      <button className='logout-button' onClick={handleLogout}>Logi välja</button>
    </div>
  );
};

export default Homepage;