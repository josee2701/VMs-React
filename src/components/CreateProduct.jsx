// src/components/CreateProduct.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function CreateProduct() {
  const [cod, setCod]                     = useState('');
  const [name, setName]                   = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [priceCop, setPriceCop]           = useState('');
  const [priceUsd, setPriceUsd]           = useState('');
  const [company, setCompany]             = useState('');
  const [companies, setCompanies]         = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const navigate = useNavigate();

  // 🔒 Solo administradores pueden crear productos
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const groups  = payload.groups || [];
    const isAdmin = groups.includes('Admin') || groups.includes('administrador');
    if (!isAdmin) {
      navigate('/products', { replace: true });
    }
  }, [navigate]);

  // 🌐 Carga lista de compañías para el select
  useEffect(() => {
    api.get('/api/companies/')
      .then(({ data }) => setCompanies(data))
      .catch(err => console.error('Error al cargar compañías:', err))
      .finally(() => setCompaniesLoading(false));
  }, []);

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
      const response = await api.post('/api/products/', payload);
      if (response.status === 201 || response.status === 200) {
        alert('✅ Producto creado con éxito');
        navigate('/products', { replace: true });
      } else {
        alert(`Creado, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al crear producto:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al crear el producto. Intenta de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          Crear nuevo Producto
        </h2>

        {/* Código */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Código</label>
          <input
            type="text"
            value={cod}
            onChange={e => setCod(e.target.value)}
            maxLength={50}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

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
            placeholder="0.00"
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
            placeholder="0.00"
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
            <option value="" disabled>
              {companiesLoading ? 'Cargando compañías...' : 'Selecciona una compañía'}
            </option>
            {!companiesLoading && companies.map(c => (
              <option key={c.nit} value={c.nit}>
                {c.name} ({c.nit})
              </option>
            ))}
          </select>
        </div>

        {/* Botones Crear y Cancelar */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '.75rem',
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {submitting ? 'Creando…' : 'Crear Producto'}
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
