// src/components/CreateCompany.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function CreateCompany() {
  const [nit, setNit]             = useState('');
  const [name, setName]           = useState('');
  const [address, setAddress]     = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const navigate = useNavigate();

  // 🔒 Sólo administradores pueden crear compañías
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const grupos  = payload.groups || [];
    const isAdmin = grupos.includes('Admin') || grupos.includes('administrador');
    if (!isAdmin) {
      navigate('/companies', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/api/companies/', {
        nit,
        name,
        address,
        phone_number: phoneNumber
      });
      if (response.status === 201 || response.status === 200) {
        alert('✅ Compañía creada con éxito');
        navigate('/companies', { replace: true });
      } else {
        alert(`Creada, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al crear compañía:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al crear la compañía. Intenta de nuevo.'
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
          Crear nueva Compañía
        </h2>

        {/* NIT */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>NIT</label>
          <input
            type="text"
            value={nit}
            onChange={e => setNit(e.target.value)}
            maxLength={20}
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

        {/* Dirección */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Dirección</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            maxLength={200}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Teléfono */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Teléfono</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            maxLength={20}
            placeholder="+57 300 1234567"
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
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
            {submitting ? 'Creando…' : 'Crear Compañía'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/companies')}
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
