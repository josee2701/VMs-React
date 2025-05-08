// src/components/SendPdfForm.jsx
import { useState } from 'react';
import api from '../apis.jsx';

export default function SendPdfForm() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !subject) {
      setError('Por favor completa ambos campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/pdf/', {
        email,
        subject,
      });
      if (response.status === 200) {
        setSuccess('Correo enviado correctamente.');
        setEmail('');
        setSubject('');
      } else {
        setError('No se pudo enviar el correo.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Error al enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Enviar PDF de Stock por Correo</h3>
      {error && <p style={errorStyle}>{error}</p>}
      {success && <p style={successStyle}>{success}</p>}

      <div style={fieldStyle}>
        <label htmlFor="email">Correo destinatario:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="subject">Asunto:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Enviando...' : 'Enviar PDF'}
      </button>
    </form>
  );
}

// Estilos inline
const formStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
};
const fieldStyle = {
  marginBottom: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
};
const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};
const buttonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
const errorStyle = { color: '#dc3545', marginBottom: '0.75rem' };
const successStyle = { color: '#28a745', marginBottom: '0.75rem' };
