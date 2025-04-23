// src/components/VmsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt';

export default function VmsList() {
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Decodifica el token para extraer el rol
  const token = localStorage.getItem('jwt') || '';
  const payload = parseJwt(token);
  const rol = payload.rol || payload.role;

  // Función para borrar una VM
  const handleDelete = async id => {
    if (!window.confirm(`¿Seguro que quieres eliminar la VM #${id}?`)) return;
    try {
      await api.delete(`/vms/${id}`);
      // Actualiza el listado filtrando la VM eliminada
      setVms(prev => prev.filter(vm => vm.id !== id));
      alert('VM eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar VM:', err.response || err);
      alert(
        err.response?.data?.message ||
        'Ocurrió un error al eliminar la VM.'
      );
    }
  };

  useEffect(() => {
    const fetchVms = async () => {
      try {
        const { data } = await api.get('/vms');
        setVms(data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('jwt');
          navigate('/login', { replace: true });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVms();
  }, [navigate]);

  if (loading) return <p>Cargando VMs…</p>;
  if (error)   return <p>Error al cargar: {error}</p>;

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
          {/* Botón "Usuarios" solo para administradores */}
          {rol === 'administrador' && (
            <button
              onClick={() => navigate('/users')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#17a2b8',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Usuarios
            </button>
          )}

          {/* Botón "Crear VM" solo para administradores */}
          {rol === 'administrador' && (
            <button
              onClick={() => navigate('/vms/create')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Crear VM
            </button>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nombre</th>
            <th style={th}>Estado</th>
            {rol === 'administrador' && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {vms.map(vm => (
            <tr key={vm.id}>
              <td style={td}>{vm.id}</td>
              <td style={td}>{vm.name}</td>
              <td style={td}>{vm.status}</td>
              {rol === 'administrador' && (
                <td style={td}>
                  <button
                    onClick={() => navigate(`/vms/${vm.id}/edit`)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vm.id)}
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
