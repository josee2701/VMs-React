// src/components/EditStock.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function EditStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState('');
  const [product, setProduct]   = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔒 Solo administradores pueden editar stock
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const groups  = payload.groups || [];
    const isAdmin = groups.includes('Admin') || groups.includes('administrador');
    if (!isAdmin) {
      navigate('/stock', { replace: true });
      return;
    }

    // Carga simultánea de productos y datos del stock
    const fetchData = async () => {
      try {
        const [prodsRes, stockRes] = await Promise.all([
          api.get('/api/products/'),
          api.get(`/api/stocks/${id}/`)
        ]);
        setProducts(prodsRes.data || []);
        const item = stockRes.data;
        setProduct(item.product || '');
        setQuantity(item.quantity != null ? item.quantity : '');
      } catch (err) {
        console.error('Error al cargar datos:', err.response || err);
        alert('No se pudo cargar el stock. Volviendo…');
        navigate('/stock', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        quantity: quantity ? parseInt(quantity, 10) : null,
        product: product || null
      };
      const response = await api.put(`/api/stocks/${id}/`, payload);
      if (response.status === 200) {
        alert('✅ Stock actualizado con éxito');
        navigate('/stock', { replace: true });
      } else {
        alert(`Actualizado, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al actualizar stock:', err.response || err);
      alert(err.response?.data?.message || '❌ Error al actualizar stock');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: '1rem' }}>Cargando datos...</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={handleSubmit} style={{ width: '360px', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Editar Stock #{id}</h2>

        {/* Producto */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Producto</label>
          <select
            value={product}
            onChange={e => setProduct(e.target.value)}
            required
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          >
            <option value="" disabled>Selecciona un producto</option>
            {products.map(p => (
              <option key={p.cod} value={p.cod}>{p.name} ({p.cod})</option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min={0}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Botones Guardar y Cancelar */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ flex: 1, padding: '.75rem', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/stock')}
            style={{ flex: 1, padding: '.75rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

