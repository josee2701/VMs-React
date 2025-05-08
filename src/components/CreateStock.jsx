// src/components/CreateStock.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function CreateStock() {
  const [quantity, setQuantity] = useState('');
  const [product, setProduct]   = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 🔒 Solo administradores pueden crear stock
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const groups  = payload.groups || [];
    const isAdmin = groups.includes('Admin') || groups.includes('administrador');
    if (!isAdmin) {
      navigate('/stock', { replace: true });
      return;
    }
    // 🌐 Carga lista de productos para el select
    api.get('/api/products/')
      .then(({ data }) => setProducts(data))
      .catch(err => console.error('Error al cargar productos:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        quantity: quantity ? parseInt(quantity, 10) : null,
        product: product || null
      };
      const response = await api.post('/api/stocks/', payload);
      if (response.status === 201 || response.status === 200) {
        alert('✅ Stock creado con éxito');
        navigate('/stock', { replace: true });
      } else {
        alert(`Creado, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al crear stock:', err.response || err);
      alert(err.response?.data?.message || '❌ Error al crear stock');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando productos…</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={handleSubmit} style={{ width: '360px', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Crear Stock</h2>

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
              <option key={p.cod} value={p.cod}>
                {p.name} ({p.cod})
              </option>
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

        {/* Botones Crear y Cancelar */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ flex: 1, padding: '.75rem', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            {submitting ? 'Creando…' : 'Crear Stock'}
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
