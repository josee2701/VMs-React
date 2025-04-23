import React, { useState } from 'react';
import api from '../apis.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Envía sólo email y password
      const response = await api.post('/login', { email, password });
      console.log('Respuesta de la API:', response.data);
      // aquí podrías guardar el token o redirigir
    } catch (err) {
      console.error('Error al hacer login:', err.response || err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '350px',
        padding: '2rem',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '1.1rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px'
        }}>
          Enviar
        </button>

        <button
          type="button"
          onClick={() => window.location.href = '/register'}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            marginTop: '0.75rem',
            background: 'transparent',
            border: 'none',
            color: '#007BFF',
            cursor: 'pointer'
          }}
        >
          Registrar usuario
        </button>
      </form>
    </div>
  );
}
