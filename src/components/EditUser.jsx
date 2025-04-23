// src/components/EditUser.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [rol,     setRol]     = useState('cliente');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔒 Guardia de rol
  useEffect(() => {
    const token   = localStorage.getItem('jwt') || '';
    const payload = parseJwt(token);
    const userRol = payload.rol || payload.role;
    if (userRol !== 'administrador') {
      navigate('/users', { replace: true });
    }
  }, [navigate]);

  // ⚙️ Carga datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setName(data.name);
        setEmail(data.email);
        setRol(data.rol || data.role);
      } catch (err) {
        console.error('Error al cargar usuario:', err.response || err);
        alert('No se pudo cargar el usuario. Volviendo a la lista.');
        navigate('/users', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    // Construye payload
    const payload = { name, email, rol };
    if (password.trim()) {
      payload.password = password;
    }

    try {
      const resp = await api.put(`/users/${id}`, payload);
      if (resp.status === 200) {
        alert('✅ Usuario actualizado con éxito');
        navigate('/users', { replace: true });
      } else {
        alert(`Recibí status ${resp.status} al actualizar.`);
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al actualizar el usuario.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: '1rem' }}>Cargando datos del usuario…</p>;
  }

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
          Editar Usuario #{id}
        </h2>

        {/* Nombre */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
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

        {/* Contraseña opcional */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Contraseña (deja vacío para no cambiar)
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Rol */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Rol</label>
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            style={{ width: '100%', padding: '.5rem' }}
          >
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', padding: '.75rem', fontSize: '1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            backgroundColor: '#007BFF', color: '#fff',
            border: 'none', borderRadius: '4px'
          }}
        >
          {submitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
