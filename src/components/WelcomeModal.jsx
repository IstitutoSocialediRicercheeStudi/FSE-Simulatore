import React, { useState, useEffect } from 'react';

const WELCOME_KEY = 'fse_welcome_dismissed';

function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(WELCOME_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(WELCOME_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: '#fff', borderRadius: '12px', maxWidth: '600px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1c3654 0%, #2d5f8a 100%)',
            padding: '2rem 2rem 1.5rem', color: 'white', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              <svg style={{ width: '48px', height: '48px', fill: 'white' }}>
                <use href="/sprites.svg#it-presentation" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>
              Benvenuto nel Simulatore FSE+
            </h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.5rem', marginBottom: 0 }}>
              Ambiente di formazione per la Progettazione Esecutiva
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem 2rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.6, marginBottom: '1rem' }}>
              Questo simulatore riproduce fedelmente il portale <strong>PR FSE+ 2021-2027</strong> della Regione Siciliana.
              Ti permettera di esercitarti nella compilazione della Progettazione Esecutiva senza rischi.
            </p>

            <div style={{ fontSize: '0.82rem', color: '#444' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1c3654', marginBottom: '0.75rem' }}>
                Cosa dovrai fare:
              </h4>
              <div className="d-flex align-items-start mb-2" style={{ gap: '0.6rem' }}>
                <span style={{ backgroundColor: '#0d6efd', color: 'white', borderRadius: '50%', width: '22px', height: '22px', minWidth: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>1</span>
                <span><strong>Seleziona un ruolo</strong> tra quelli disponibili (es. Legale Rappresentante)</span>
              </div>
              <div className="d-flex align-items-start mb-2" style={{ gap: '0.6rem' }}>
                <span style={{ backgroundColor: '#0d6efd', color: 'white', borderRadius: '50%', width: '22px', height: '22px', minWidth: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>2</span>
                <span><strong>Compila i moduli formativi</strong> e le ore per ogni corso</span>
              </div>
              <div className="d-flex align-items-start mb-2" style={{ gap: '0.6rem' }}>
                <span style={{ backgroundColor: '#0d6efd', color: 'white', borderRadius: '50%', width: '22px', height: '22px', minWidth: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>3</span>
                <span><strong>Inserisci i dettagli</strong> dell'edizione (date, partecipanti, personale, stage)</span>
              </div>
              <div className="d-flex align-items-start mb-2" style={{ gap: '0.6rem' }}>
                <span style={{ backgroundColor: '#0d6efd', color: 'white', borderRadius: '50%', width: '22px', height: '22px', minWidth: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>4</span>
                <span><strong>Verifica, firma e richiedi</strong> le risorse per completare la simulazione</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px',
              padding: '0.75rem 1rem', marginTop: '1rem', fontSize: '0.78rem', color: '#664d03'
            }}>
              <strong>Suggerimento:</strong> Usa il cronometro in alto a destra per misurare il tempo impiegato.
              Cerca l'icona <svg style={{ width: '14px', height: '14px', fill: '#0d6efd', verticalAlign: '-2px' }}><use href="/sprites.svg#it-info-circle" /></svg> per i suggerimenti contestuali.
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 2rem 1.5rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn text-white"
              style={{
                backgroundColor: '#0d6efd', fontSize: '0.9rem', fontWeight: 600,
                padding: '0.6rem 2.5rem', borderRadius: '6px', border: 'none'
              }}
              onClick={handleClose}
            >
              Inizia la simulazione
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default WelcomeModal;
