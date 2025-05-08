// src/components/UsersList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt';
import ConfirmModal from './ConfirmModal';

export default function UsersList() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [toDeleteId, setToDeleteId] = useState(null);
  const navigate                    = useNavigate();

  // 0️⃣ Token + permisos
  const token   = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : {};
  const grupos  = payload.groups || [];
  const isAdmin = grupos.includes('administrador') || grupos.includes('Admin');

  // 1️⃣ Fetch inicial
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    api.get('/api/users/')
      .then(({ data }) => setUsers(data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login', { replace: true });
        } else setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // ✋ Único responsable de abrir el modal
  const openDeleteModal = id => {
    setToDeleteId(id);
  };

  // ✅ Ejecuta el DELETE y cierra modal
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/users/${toDeleteId}/`);
      setUsers(prev => prev.filter(u => u.id !== toDeleteId));
      alert('Usuario eliminado');
    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Error al eliminar');
    } finally {
      setToDeleteId(null);
    }
  };

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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate('/companies')}
            style={btnInfo}
          >
            Empresas
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/users/create')}
              style={btnSuccess}
            >
              Crear Usuario
            </button>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Email</th>
            <th style={th}>Grupo</th>
            {isAdmin && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const nombres = `${u.first_name || ''} ${u.last_name || ''}`.trim();
            return (
              <tr key={u.id}>
                <td style={td}>{u.id}</td>
                <td style={td}>{nombres || '-'}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>{(u.groups || []).join(', ')}</td>
                {isAdmin && (
                  <td style={td}>
                    <button
                      onClick={() => navigate(`/users/edit/${u.id}`)}
                      style={btnPrimary}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(u.id)}
                      style={{ ...btnDanger, marginLeft: '0.5rem' }}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={toDeleteId !== null}
        title="¿Eliminar usuario?"
        message={`¿Seguro que quieres borrar al usuario #${toDeleteId}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDeleteId(null)}
      />
    </div>
  );
}

// ↓ estilos (igual que antes)
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
const btnPrimary = {
  padding: '0.25rem 0.5rem',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
const btnSuccess = {
  ...btnPrimary,
  backgroundColor: '#28a745'
};
const btnDanger = {
  ...btnPrimary,
  backgroundColor: '#dc3545'
};
const btnInfo = {
  ...btnPrimary,
  backgroundColor: '#17a2b8'
};
