// src/components/UsersList.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { WSContext } from '../services/wsContext';
import { parseJwt } from '../utils/jwt';

export default function UsersList() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();

  // **WebSocket**
  const { lastUserEvent } = useContext(WSContext);

  // Decodifica el token y extrae el rol
  const token   = localStorage.getItem('jwt') || '';
  const payload = parseJwt(token);
  const rol     = payload.rol || payload.role;

  // Borrar usuario
  const handleDelete = async id => {
    if (!window.confirm(`¿Eliminar usuario #${id}?`)) return;
    try {
      await api.delete(`/users/${id}`);
      // opcional: también puedes enviar un event de WS si quieres notificar al resto
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('Usuario eliminado');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  // 1) Carga inicial REST
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login', { replace: true });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  // 2) Suscríbete a los eventos de WS
  useEffect(() => {
    if (!lastUserEvent) return;

    switch (lastUserEvent.event) {
      case 'user_created':
        setUsers(prev => [...prev, lastUserEvent.user]);
        break;

      case 'user_updated':
        setUsers(prev =>
          prev.map(u =>
            u.id === lastUserEvent.user.id ? lastUserEvent.user : u
          )
        );
        break;

      case 'user_deleted':
        setUsers(prev =>
          prev.filter(u => u.id !== lastUserEvent.user.id)
        );
        break;

      default:
        break;
    }
  }, [lastUserEvent]);

  if (loading) return <p>Cargando usuarios…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2>Listado de Usuarios</h2>
        {rol === 'administrador' && (
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Crear Usuario
          </button>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Email</th>
            <th style={th}>Rol</th>
            {rol === 'administrador' && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={td}>{u.id}</td>
              <td style={td}>{u.name}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.rol || u.role}</td>
              {rol === 'administrador' && (
                <td style={td}>
                  <button
                    onClick={() => navigate(`/users/${u.id}/edit`)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{ color: '#dc3545' }}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  border: '1px solid #ddd',
  padding: '8px',
  background: '#f0f0f0',
  textAlign: 'left'
};
const td = {
  border: '1px solid #ddd',
  padding: '8px'
};
