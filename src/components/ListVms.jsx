// src/components/VmsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt';

export default function VmsList() {
  const [vms, setVms]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  const token   = localStorage.getItem('jwt') || '';
  const payload = parseJwt(token);
  const rol     = payload.rol || payload.role;

  const handleDelete = async id => {
    if (!window.confirm(`¿Eliminar VM #${id}?`)) return;
    try {
      await api.delete(`/vms/${id}`);
      setVms(prev => prev.filter(vm => vm.id !== id));
      alert('VM eliminada correctamente');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al eliminar VM.');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/vms');
        setVms(data);
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
    })();
  }, [navigate]);

  if (loading) return <p>Cargando VMs…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2>Lista de VMs</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {rol === 'administrador' && (
            <>
              <button
                onClick={() => navigate('/users')}
                style={btnInfo}
              >Usuarios</button>
              <button
                onClick={() => navigate('/vms/create')}
                style={btnSuccess}
              >Crear VM</button>
            </>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Estado</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vms.map(vm => (
            <tr key={vm.id}>
              <td style={td}>{vm.id}</td>
              <td style={td}>{vm.name}</td>
              <td style={td}>{vm.status}</td>
              <td style={td}>
                {/* Ver: disponible para todos */}
                <button
                  onClick={() => navigate(`/vms/${vm.id}`)}
                  style={btnPrimary}
                >Ver</button>

                {/* Solo admin: Editar / Eliminar */}
                {rol === 'administrador' && (
                  <>
                    <button
                      onClick={() => navigate(`/vms/${vm.id}/edit`)}
                      style={{ ...btnPrimary, marginLeft: '0.5rem' }}
                    >Editar</button>
                    <button
                      onClick={() => handleDelete(vm.id)}
                      style={{ ...btnDanger, marginLeft: '0.5rem' }}
                    >Eliminar</button>
                  </>
                )}
              </td>
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
