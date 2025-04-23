import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import Login from './components/Login';

export default function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* para cualquier otra ruta, redirige a /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  
  );
}
