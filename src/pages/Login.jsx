import React, { useState } from 'react';
import { useAppData } from '../context/useAppData.js';

function Login() {
  const { login, navigateTo } = useAppData();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) {
      setError('Inserisci il tuo nome per continuare');
      return;
    }
    if (name.length < 2) {
      setError('Il nome deve avere almeno 2 caratteri');
      return;
    }
    login(name);
  };

  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#e2ddf0', padding: '4rem 1rem' }} className="d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1c3654 0%, #2d5f8a 100%)',
          padding: '2rem', textAlign: 'center', color: 'white'
        }}>
          <img src="/logo-regione-siciliana.png" alt="Logo Regione" style={{ height: '4rem', marginBottom: '0.75rem' }} />
          <h4 style={{ fontWeight: 500, letterSpacing: '0.5px', margin: 0 }}>PR FSE+ 2021-2027</h4>
          <p style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.3rem', marginBottom: 0 }}>
            Simulatore di Formazione
          </p>
        </div>

        {/* Body */}
        <div className="card-body p-4">
          <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#1c3654', textAlign: 'center', marginBottom: '0.5rem' }}>
            Accedi al simulatore
          </h5>
          <p style={{ fontSize: '0.8rem', color: '#6c757d', textAlign: 'center', marginBottom: '1.5rem' }}>
            Inserisci il tuo nome per accedere. Se e' la prima volta, verra creato automaticamente un profilo per te.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#333', marginBottom: '0.4rem', display: 'block' }}>
                Il tuo nome
              </label>
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Es: Mario Rossi"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                autoFocus
                autoComplete="off"
                style={{
                  padding: '0.7rem 1rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: error ? '2px solid #dc3545' : '2px solid #dee2e6'
                }}
              />
              {error && (
                <div style={{ fontSize: '0.78rem', color: '#dc3545', marginTop: '0.4rem' }}>{error}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn w-100 text-white"
              style={{
                backgroundColor: '#0d6efd',
                padding: '0.7rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none'
              }}
            >
              Entra
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              type="button"
              className="border-0 bg-transparent"
              style={{ fontSize: '0.78rem', color: '#0d6efd', fontWeight: 600 }}
              onClick={() => navigateTo('classifica')}
            >
              Vedi la classifica
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '0.75rem 1.5rem', textAlign: 'center', borderTop: '1px solid #e9ecef' }}>
          <span style={{ fontSize: '0.72rem', color: '#6c757d' }}>
            I tuoi progressi vengono salvati automaticamente
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
