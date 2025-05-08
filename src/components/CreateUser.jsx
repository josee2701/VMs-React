// src/components/CreateUser.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function CreateUser() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [groups, setGroups]       = useState(['Visit']);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 🔒 Sólo administradores pueden crear usuarios
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const userGroups = payload.groups || [];
    const isAdmin = userGroups.includes('Admin') || userGroups.includes('administrador');
    if (!isAdmin) {
      navigate('/users', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/api/users/', {
        first_name: firstName,
        last_name:  lastName,
        email,
        password,
        groups
      });
      if (response.status === 201 || response.status === 200) {
        alert('✅ Usuario creado con éxito');
        navigate('/users', { replace: true });
      } else {
        alert(`Creado, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al crear usuario:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al crear el usuario. Intenta de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '360px', padding: '2rem', background: '#fff',
        borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '1rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Crear nuevo Usuario
        </h2>

        {/* Nombre */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Nombre</label>
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            maxLength={100}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Apellido */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            maxLength={100}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Contraseña */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Rol */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Rol</label>
          <select
            value={groups[0]}
            onChange={e => setGroups([e.target.value])}
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          >
            <option value="Visit">Externo</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>

        {/* Botones Crear y Cancelar */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '.75rem',
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {submitting ? 'Creando…' : 'Crear Usuario'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/users')}
            style={{
              flex: 1,
              padding: '.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
