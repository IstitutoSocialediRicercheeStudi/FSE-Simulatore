import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext.jsx';
import AppRouter from './AppRouter';

/* ── Schermata di blocco per WebDriver ─────────────────────────────────── */
function BotBlock() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem'
    }}>
      <div style={{
        maxWidth: 480, textAlign: 'center', background: '#fff',
        borderRadius: 8, padding: '2.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        borderTop: '6px solid #d9534f'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#d9534f" viewBox="0 0 16 16" style={{ marginBottom: '1rem' }}>
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
        </svg>
        <h2 style={{ color: '#d9534f', marginBottom: '0.75rem' }}>Accesso negato</h2>
        <p style={{ color: '#555', marginBottom: 0 }}>
          L&apos;accesso tramite strumenti automatizzati non è consentito.<br />
          Utilizzare un browser standard per accedere al portale.
        </p>
      </div>
    </div>
  );
}

/* ── Toast in-app per alert bot ─────────────────────────────────────────── */
function BotAlertToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timerId = null;
    const handler = (event) => {
      if (timerId) clearTimeout(timerId);
      setToast(event.detail);
      timerId = setTimeout(() => setToast(null), 6000);
    };
    window.addEventListener('bot-alert', handler);
    return () => {
      window.removeEventListener('bot-alert', handler);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 99999,
        maxWidth: 380,
        background: '#fff',
        border: '2px solid #d9534f',
        borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        padding: '1rem 1.25rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
        animation: 'slideInRight 0.25s ease'
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#d9534f" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: '2px' }}>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: '#d9534f', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
          {toast.title}
        </div>
        <div style={{ color: '#444', fontSize: '0.8rem', lineHeight: 1.4 }}>
          {toast.body}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setToast(null)}
        aria-label="Chiudi"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#999', fontSize: '1.1rem', lineHeight: 1, padding: 0, flexShrink: 0
        }}
      >
        ×
      </button>
    </div>
  );
}

/* ── Animazione CSS per il toast ─────────────────────────────────────────── */
const TOAST_STYLE = `
@keyframes slideInRight {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}
`;

/* ── App root ────────────────────────────────────────────────────────────── */
function App() {
  // Inietta keyframe animation una sola volta
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = TOAST_STYLE;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Bot detection disabled in dev mode — stealth.js handles this in production
  // if (typeof navigator !== 'undefined' && navigator.webdriver) {
  //   return <BotBlock />;
  // }

  return (
    <BrowserRouter>
      <AppDataProvider>
        <AppRouter />
        <BotAlertToast />
      </AppDataProvider>
    </BrowserRouter>
  );
}

export default App;
