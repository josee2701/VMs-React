import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Define /login y /register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirige la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Cualquier otra, también a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
