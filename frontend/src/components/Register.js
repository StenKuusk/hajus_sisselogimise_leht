import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import Popup from './Popup';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setPopupMessage('Username cannot be empty');
      setShowPopup(true);
      return;
    }

    if (!password) {
      setPopupMessage('Password cannot be empty');
      setShowPopup(true);
      return;
    }

    try {
      // Taotleb registreerimist
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      setPopupMessage('Registration successful!');
      setShowPopup(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error); // Viga registreerimisel
      if (error.response) {
        // Kontrollime, kas vastus sisaldab sõnumit
        setPopupMessage(error.response.data.message || 'Registration failed');
      } else {
        setPopupMessage('Registration failed');
      }
      setShowPopup(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
          value={username} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
        />
        <button type="submit">Register</button>
        <button type="button" className='cancel-button' onClick={() => navigate('/login')}>Cancel</button>
      </form>
      {showPopup && (
        <Popup 
          message={popupMessage} 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </div>
  );
};

export default Register;