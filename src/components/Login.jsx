import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      console.log('Respuesta de la API:', response.data);
      // 1 Extrae y guarda el JWT en localStorage
      const { access_token } = response.data;
      localStorage.setItem('jwt', access_token);;
      // 2️⃣ Redirigimos a /vms
      navigate('/vms', { replace: true });
    } catch (err) {
      console.error('Error al hacer login:', err.response || err);
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '350px', padding: '2rem', background: '#fff',
        borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '1.1rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          />
        </div>

        <button type="submit" style={{
          width: '100%', padding: '.75rem', fontSize: '1rem',
          cursor: 'pointer', backgroundColor: '#007BFF',
          color: '#fff', border: 'none', borderRadius: '4px'
        }}>
          Enviar
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{
            width: '100%', padding: '.75rem', fontSize: '1rem',
            marginTop: '.75rem', background: 'transparent',
            border: 'none', color: '#007BFF', cursor: 'pointer'
          }}
        >
          Registrar usuario
        </button>
      </form>
    </div>
  );
}
