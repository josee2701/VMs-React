// src/components/EditVm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt';

export default function EditVm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName]     = useState('');
  const [cores, setCores]   = useState(1);
  const [ram, setRam]       = useState(1);
  const [disk, setDisk]     = useState(1);
  const [os, setOs]         = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🚦 Guardia de rol
  useEffect(() => {
    const token   = localStorage.getItem('jwt') || '';
    const payload = parseJwt(token);
    const rol     = payload.rol || payload.role;
    if (rol !== 'administrador') {
      navigate('/vms', { replace: true });
    }
  }, [navigate]);

  // ⚙️ Carga los datos de la VM al montar
  useEffect(() => {
    const fetchVm = async () => {
      try {
        const { data } = await api.get(`/vms/${id}`);
        setName(data.name);
        setCores(data.cores);
        setRam(data.ram);
        setDisk(data.disk);
        setOs(data.os);
        setStatus(data.status);
      } catch (err) {
        console.error('Error al cargar VM:', err.response || err);
        alert('No se pudo cargar la VM. Redirigiendo a la lista.');
        navigate('/vms', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchVm();
  }, [id, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await api.put(`/vms/${id}`, {
        name, cores, ram, disk, os, status
      });
      if (resp.status === 200) {
        alert('✅ VM actualizada con éxito');
        navigate('/vms', { replace: true });
      } else {
        alert(`Recibí status ${resp.status} al actualizar.`);
      }
    } catch (err) {
      console.error('Error al actualizar VM:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al actualizar la VM.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: '1rem' }}>Cargando datos de la VM…</p>;
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
          Editar VM #{id}
        </h2>

        {/* Name */}
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

        {/* Cores */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Cores</label>
          <input
            type="number"
            value={cores}
            onChange={e => setCores(+e.target.value)}
            min={1}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* RAM */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>RAM (MB)</label>
          <input
            type="number"
            value={ram}
            onChange={e => setRam(+e.target.value)}
            min={1}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Disk */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Disco (GB)</label>
          <input
            type="number"
            value={disk}
            onChange={e => setDisk(+e.target.value)}
            min={1}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* OS */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Sistema operativo</label>
          <input
            type="text"
            value={os}
            onChange={e => setOs(e.target.value)}
            maxLength={100}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>Estado</label>
          <input
            type="text"
            value={status}
            onChange={e => setStatus(e.target.value)}
            maxLength={20}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', padding: '.75rem', fontSize: '1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            backgroundColor: '#007BFF', color: '#fff',
            border: 'none', borderRadius: '4px'
          }}
        >
          {submitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
