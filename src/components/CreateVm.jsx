// src/components/CreateVm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis.jsx';
import { parseJwt } from '../utils/jwt';

export default function CreateVm() {
  const [name, setName]     = useState('');
  const [cores, setCores]   = useState(1);
  const [ram, setRam]       = useState(1);
  const [disk, setDisk]     = useState(1);
  const [os, setOs]         = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // --- Comprueba rol al montar ---
  useEffect(() => {
    const token = localStorage.getItem('jwt') || '';
    const payload = parseJwt(token);
    const rol = payload.rol || payload.role;
    if (rol !== 'administrador') {
      // Si no es admin, no puede entrar aquí
      navigate('/vms', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/vms', {
        name,
        cores,
        ram,
        disk,
        os,
        status
      });
      if (response.status === 201) {
        alert('✅ VM creada con éxito');
        navigate('/vms', { replace: true });
      } else {
        // Por si el backend devolviera otro código
        alert(`Creado, pero recibí status ${response.status}`);
      }
    } catch (err) {
      console.error('Error al crear VM:', err.response || err);
      alert(
        err.response?.data?.message ||
        '❌ Ocurrió un error al crear la VM. Intenta de nuevo.'
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
          Crear nueva VM
        </h2>

        {/* Name */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Nombre
          </label>
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
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Cores
          </label>
          <input
            type="number"
            value={cores}
            onChange={e => setCores(parseInt(e.target.value, 10))}
            min={1}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* RAM */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            RAM (MB)
          </label>
          <input
            type="number"
            value={ram}
            onChange={e => setRam(parseInt(e.target.value, 10))}
            min={1}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* Disk */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Disco (GB)
          </label>
          <input
            type="number"
            value={disk}
            onChange={e => setDisk(parseInt(e.target.value, 10))}
            min={1}
            required
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>

        {/* OS */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Sistema operativo
          </label>
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
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            Estado
          </label>
          <input
            type="text"
            value={status}
            onChange={e => setStatus(e.target.value)}
            maxLength={20}
            placeholder="running, stopped…"
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
            backgroundColor: '#28a745', color: '#fff',
            border: 'none', borderRadius: '4px'
          }}
        >
          {submitting ? 'Creando…' : 'Crear VM'}
        </button>
      </form>
    </div>
  );
}
