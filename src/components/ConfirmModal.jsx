// src/components/ConfirmModal.jsx

export default function ConfirmModal({
  isOpen,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  // estilos inline básicos; puedes extraerlos a un CSS
  const backdrop = {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  };
  const box = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    textAlign: 'center'
  };
  const btn = {
    padding: '0.5rem 1rem',
    margin: '0 .5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div style={backdrop}>
      <div style={box}>
        <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
        <p style={{ marginBottom: '1.5rem' }}>{message}</p>
        <button
          style={{ ...btn, backgroundColor: '#dc3545', color: '#fff' }}
          onClick={onConfirm}
        >
          Eliminar
        </button>
        <button
          style={{ ...btn, backgroundColor: '#6c757d', color: '#fff' }}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
