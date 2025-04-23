// src/components/ViewVm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apis.jsx';

export default function ViewVm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vm, setVm] = useState({
    name: '',
    cores: 1,
    ram: 1,
    disk: 1,
    os: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/vms/${id}`);
        setVm({
          name: data.name,
          cores: data.cores,
          ram: data.ram,
          disk: data.disk,
          os: data.os,
          status: data.status
        });
      } catch (err) {
        console.error('Error al cargar VM:', err);
        alert('No se pudo cargar la VM.');
        navigate('/vms', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return <p style={{ padding: '1rem' }}>Cargando detalles…</p>;
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', backgroundColor: '#f5f5f5'
    }}>
      <form style={{
        width: '360px', padding: '2rem', background: '#fff',
        borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '1rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Detalles de VM #{id}
        </h2>

        {/** Cada campo como input solo lectura **/}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Nombre</label>
          <input
            type="text"
            value={vm.name}
            readOnly
            style={{ width: '100%', padding: '.5rem', background: '#e9ecef' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Cores</label>
          <input
            type="number"
            value={vm.cores}
            readOnly
            style={{ width: '100%', padding: '.5rem', background: '#e9ecef' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>RAM (MB)</label>
          <input
            type="number"
            value={vm.ram}
            readOnly
            style={{ width: '100%', padding: '.5rem', background: '#e9ecef' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Disco (GB)</label>
          <input
            type="number"
            value={vm.disk}
            readOnly
            style={{ width: '100%', padding: '.5rem', background: '#e9ecef' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Sistema operativo</label>
          <input
            type="text"
            value={vm.os}
            readOnly
            style={{ width: '100%', padding: '.5rem', background: '#e9ecef' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Estado</label>
          <input
            type="text"
            value={vm.status}
            readOnly
            style={{ width: '100%', padding: '.5rem', background: '#e9ecef' }}
          />
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            width: '100%', padding: '.75rem', fontSize: '1rem',
            backgroundColor: '#6c757d', color: '#fff',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </form>
    </div>
  );
}
