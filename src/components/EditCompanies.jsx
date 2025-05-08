// src/components/EditCompany.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt.jsx';

export default function EditCompany() {
  const { nit } = useParams();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [address, setAddress]   = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔒 Sólo administradores pueden editar
  useEffect(() => {
    const token   = localStorage.getItem('token') || '';
    const payload = parseJwt(token);
    const grupos  = payload.groups || [];
    const isAdmin = grupos.includes('Admin') || grupos.includes('administrador');
    if (!isAdmin) {
      navigate('/companies', { replace: true });
    }
  }, [navigate]);

  // ⚙️ Carga datos de la compañía
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await api.get(`/api/companies/${nit}/`);
        setName(data.name || '');
        setAddress(data.address || '');
        setPhoneNumber(data.phone_number || '');
      } catch (err) {
        console.error('Error al cargar compañía:', err.response || err);
        alert('No se pudo cargar la compañía. Volviendo a la lista.');
        navigate('/companies', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [nit, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.put(`/api/companies/${nit}/`, {
        nit,
        name,
        address,
        phone_number: phoneNumber
      });
      if (response.status === 200) {
        alert('✅ Compañía actualizada con éxito');
        navigate('/companies', { replace: true });
      } else {
        alert(`Actualizada, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al actualizar compañía:', err.response || err);
      alert(err.response?.data?.message || '❌ Error al actualizar la compañía.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: '1rem' }}>Cargando datos de la compañía…</p>;
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
          Editar Compañía {nit}
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
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
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
