// src/components/CompaniesList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';
import ConfirmModal from './ConfirmModal';

export default function CompaniesList() {
  const [companies, setCompanies]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [toDeleteNit, setToDeleteNit] = useState(null);
  const navigate                    = useNavigate();

  // 0️⃣ Token y roles
  const token   = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : {};
  const groups  = payload.groups || [];
  const isAdmin = groups.includes('administrador') || groups.includes('Admin');

  // 1️⃣ Fetch inicial de compañías
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    api.get('/api/companies/')
      .then(({ data }) => setCompanies(data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login', { replace: true });
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // 👉 Abre el modal de confirmación
  const openDeleteModal = nit => {
    setToDeleteNit(nit);
  };

  // ✅ Confirma y ejecuta el DELETE real
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/companies/${toDeleteNit}/`);
      setCompanies(prev => prev.filter(c => c.nit !== toDeleteNit));
      alert(`Compañía ${toDeleteNit} eliminada`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Error al eliminar compañía');
    } finally {
      setToDeleteNit(null);
    }
  };

  if (loading) return <p>Cargando compañías…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2>Listado de Compañías</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate('/users')}
            style={btnInfo}
          >
            Usuarios
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/companies/create')}
              style={btnSuccess}
            >
              Crear Compañía
            </button>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>NIT</th>
            <th style={th}>Nombre</th>
            <th style={th}>Dirección</th>
            <th style={th}>Teléfono</th>
            {isAdmin && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.nit}>
              <td style={td}>{c.nit}</td>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.address}</td>
              <td style={td}>{c.phone_number}</td>
              {isAdmin && (
                <td style={td}>
                  <button
                    onClick={() => navigate(`/companies/edit/${c.nit}`)}
                    style={btnPrimary}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(c.nit)}
                    style={{ ...btnDanger, marginLeft: '0.5rem' }}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación reutilizable */}
      <ConfirmModal
        isOpen={toDeleteNit !== null}
        title="¿Eliminar Compañía?"
        message={`¿Seguro que quieres borrar la compañía con NIT ${toDeleteNit}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDeleteNit(null)}
      />
    </div>
  );
}

// — estilos igual que antes —
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
