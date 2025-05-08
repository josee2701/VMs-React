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
          {/* Autenticación */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
{/* 
          {/* VMs */}
          

          {/* Redirecciones */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}
