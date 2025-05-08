// src/components/ProductsList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';
import ConfirmModal from './ConfirmModal';

export default function ProductsList() {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [toDeleteCod, setToDeleteCod]   = useState(null);
  const navigate                        = useNavigate();

  // 0️⃣ Token y permiso
  const token   = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : {};
  const groups  = payload.groups || [];
  const isAdmin = groups.includes('Admin') || groups.includes('administrador');

  // 1️⃣ Fetch inicial de productos
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    api.get('/api/products/')
      .then(({ data }) => setProducts(data))
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

  // Abre el modal
  const openDeleteModal = cod => setToDeleteCod(cod);

  // Confirmar borrado
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/products/${toDeleteCod}/`);
      setProducts(prev => prev.filter(p => p.cod !== toDeleteCod));
      alert(`Producto ${toDeleteCod} eliminado`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Error al eliminar producto');
    } finally {
      setToDeleteCod(null);
    }
  };

  if (loading) return <p>Cargando productos…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Listado de Productos</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => navigate('/companies')}
            style={btnInfo}
          >
            Compañías
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/productos/create')}
              style={btnSuccess}
            >
              Crear Producto
            </button>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Código</th>
            <th style={th}>Nombre</th>
            <th style={th}>Características</th>
            <th style={th}>Precio COP</th>
            <th style={th}>Precio USD</th>
            <th style={th}>Compañía</th>
            <th style={th}>Stock</th>
            {isAdmin && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.cod}>
              <td style={td}>{p.cod}</td>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.characteristics}</td>
              <td style={td}>{p.price_cop}</td>
              <td style={td}>{p.price_usd}</td>
              <td style={td}>{p.company_detail?.name || p.company}</td>
              <td style={td}>{(p.stock || []).map(s => s.quantity).join(', ')}</td>
              {isAdmin && (
                <td style={td}>
                  <button
                    onClick={() => navigate(`/productos/edit/${p.cod}`)}
                    style={btnPrimary}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(p.cod)}
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

      <ConfirmModal
        isOpen={toDeleteCod !== null}
        title="¿Eliminar Producto?"
        message={`¿Seguro que quieres borrar el producto ${toDeleteCod}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDeleteCod(null)}
      />
    </div>
  );
}

// Estilos (puedes extraer a un archivo común)
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
