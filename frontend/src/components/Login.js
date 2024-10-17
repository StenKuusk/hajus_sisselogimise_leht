import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import Popup from './Popup';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setPopupMessage('Login successful!');
      setShowPopup(true);
      setTimeout(() => {
        navigate('/homepage');
      }, 2000);
    } catch (error) {
      setPopupMessage('Invalid credentials');
      setShowPopup(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <h2>Don't have an account? Make one.</h2>
        <button className='register-button' onClick={() => navigate('/register')}>Register</button>
      {showPopup && (
        <Popup 
          message={popupMessage} 
          onClose={() => setShowPopup(false)} 
        />
      )}
      </form>
    </div>
  );
};

export default Login;