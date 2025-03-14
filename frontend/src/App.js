import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import Solitaire from './components/Solitaire';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={token ? <Homepage /> : <Navigate to="/login" />} />
          <Route path='/solitaire' element={<Solitaire />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;