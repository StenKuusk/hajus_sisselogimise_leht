import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
      <button type="button" onClick={() => navigate('/login')}>Cancel</button>
    </form>
  );
};

export default Register;