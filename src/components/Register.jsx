import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/users', { name, email, password, rol });
      alert('Usuario registrado con éxito');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error al registrar usuario:', err.response || err);
      alert(
        err.response?.data?.message ||
        'Ocurrió un error al registrar. Intenta de nuevo.'
      );
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
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Registrar usuario
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          />
        </div>

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
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Rol</label>
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          >
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <button type="submit" style={{
          width: '100%', padding: '.75rem', fontSize: '1rem',
          cursor: 'pointer', backgroundColor: '#007BFF',
          color: '#fff', border: 'none', borderRadius: '4px'
        }}>
          Crear cuenta
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            width: '100%', padding: '.75rem', fontSize: '1rem',
            marginTop: '.75rem', background: 'transparent',
            border: 'none', color: '#007BFF', cursor: 'pointer'
          }}
        >
          Volver al login
        </button>
      </form>
    </div>
  );
}
