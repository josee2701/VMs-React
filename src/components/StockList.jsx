// src/components/StockList.jsx
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';
import ConfirmModal from './ConfirmModal';

export default function StockList() {
  const [stock, setStock]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [toSendPdf, setToSendPdf]   = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const navigate                    = useNavigate();

  // 0️⃣ Token y permiso
  const token   = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : {};
  const groups  = payload.groups || [];
  const isAdmin = groups.includes('Admin') || groups.includes('administrador');

  // 1️⃣ Fetch inicial de stock
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    api.get('/api/stocks/')
      .then(({ data }) => setStock(data))
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

  // Abrir modal de confirmación
  const openDeleteModal = id => setToDeleteId(id);

  // Confirmar borrado
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/stocks/${toDeleteId}/`);
      setStock(prev => prev.filter(item => item.id !== toDeleteId));
      alert(`Stock #${toDeleteId} eliminado`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Error al eliminar stock');
    } finally {
      setToDeleteId(null);
    }
  };

  // Generar y descargar PDF del listado
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['ID', 'Producto', 'Cantidad', 'Fecha'];
    const tableRows = stock.map(item => [
      item.id,
      item.product_detail?.name || item.product,
      item.quantity,
      item.date
    ]);

    doc.text('Listado de Stock', 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid'
    });
    doc.save('stock_list.pdf');
  };

  if (loading) return <p>Cargando stock…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Listado de Stock</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/products')} style={btnInfo}>
            Productos
          </button>
          <button onClick={() => navigate('/companies')} style={btnInfo}>
            Compañías
          </button>
          {isAdmin && (
            <button onClick={() => navigate('/stock/create')} style={btnSuccess}>
              Crear Stock
            </button>
          )}
          <button onClick={generatePDF} style={btnInfo}>
            Descargar PDF
          </button>
          <button onClick={() => navigate('/stock/send-pdf')} style={btnSuccess}>
            Enviar PDF por correo
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Producto</th>
            <th style={th}>Cantidad</th>
            <th style={th}>Fecha</th>
            {isAdmin && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {stock.map(item => (
            <tr key={item.id}>
              <td style={td}>{item.id}</td>
              <td style={td}>
                {item.product_detail?.name || item.product}
                <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                  ({item.product_detail?.cod || item.product})
                </span>
              </td>
              <td style={td}>{item.quantity}</td>
              <td style={td}>{item.date}</td>
              {isAdmin && (
                <td style={td}>
                  <button
                    onClick={() => navigate(`/stock/${item.id}/edit`)}
                    style={btnPrimary}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(item.id)}
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
        isOpen={toDeleteId !== null}
        title="¿Eliminar Stock?"
        message={`¿Seguro que quieres borrar el stock #${toDeleteId}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDeleteId(null)}
      />
    </div>
  );
}

// Estilos comunes
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
