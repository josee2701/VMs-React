// src/components/EditProduct.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function EditProduct() {
  const { cod } = useParams();
  const navigate = useNavigate();

  const [name, setName]                   = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [priceCop, setPriceCop]           = useState('');
  const [priceUsd, setPriceUsd]           = useState('');
  const [company, setCompany]             = useState('');
  const [companies, setCompanies]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);

  // 🔒 Solo administradores pueden editar productos
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const groups  = payload.groups || [];
    const isAdmin = groups.includes('Admin') || groups.includes('administrador');
    if (!isAdmin) {
      navigate('/products', { replace: true });
    }
  }, [navigate]);

  // 🌐 Carga lista de compañías y datos del producto
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, productRes] = await Promise.all([
          api.get('/api/companies/'),
          api.get(`/api/products/${cod}/`)
        ]);
        setCompanies(companiesRes.data || []);
        const p = productRes.data;
        setName(p.name || '');
        setCharacteristics(p.characteristics || '');
        setPriceCop(p.price_cop != null ? p.price_cop : '');
        setPriceUsd(p.price_usd != null ? p.price_usd : '');
        setCompany(p.company || '');
      } catch (err) {
        console.error('Error al cargar datos:', err.response || err);
        alert('No se pudo cargar el producto. Volviendo a la lista.');
        navigate('/products', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cod, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      cod,
      name,
      characteristics,
      price_cop: priceCop ? parseFloat(priceCop) : null,
      price_usd: priceUsd ? parseFloat(priceUsd) : null,
      company: company || null
    };

    try {
      const response = await api.put(`/api/products/${cod}/`, payload);
      if (response.status === 200) {
        alert('✅ Producto actualizado con éxito');
        navigate('/products', { replace: true });
      } else {
        alert(`Actualizado, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al actualizar producto:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al actualizar el producto.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: '1rem' }}>Cargando datos del producto…</p>;
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
          Editar Producto {cod}
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

        {/* Características */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Características</label>
          <textarea
            value={characteristics}
            onChange={e => setCharacteristics(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          />
        </div>

        {/* Precio COP */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Precio (COP)</label>
          <input
            type="number"
            value={priceCop}
            onChange={e => setPriceCop(e.target.value)}
            min={0}
            step="0.01"
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Precio USD */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Precio (USD)</label>
          <input
            type="number"
            value={priceUsd}
            onChange={e => setPriceUsd(e.target.value)}
            min={0}
            step="0.01"
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Compañía */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Compañía</label>
          <select
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
            style={{ width: '100%', padding: '.5rem', fontSize: '1rem' }}
          >
            <option value="" disabled>Selecciona una compañía</option>
            {companies.map(c => (
              <option key={c.nit} value={c.nit}>
                {c.name} ({c.nit})
              </option>
            ))}
          </select>
        </div>

        {/* Botones Guardar y Cancelar */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '.75rem',
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/productos')}
            style={{
              flex: 1,
              padding: '.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
