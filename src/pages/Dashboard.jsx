import React from 'react';
import { useAppData } from '../context/useAppData.js';

function Dashboard() {
  const { user, navigateTo, simulationActive, startSimulation } = useAppData();

  const avvisi = [
    { title: 'Avviso Pubblico IeFP 2025/28 - Triennio', id: 1 },
    { title: 'Avviso 20/2024 - Assistenti familiari', id: 2 },
    { title: 'Avviso Pubblico IeFP 2024/27 - Triennio', id: 3 },
    { title: 'Avviso Pubblico IeFP 2024/25 - IV Annualita', id: 4 }
  ];

  const handleStartSimulation = () => {
    if (!simulationActive) {
      startSimulation();
    }
    navigateTo('roles');
  };

  return (
    <div className="container py-4 pb-5">
      {/* Welcome banner */}
      <div className="card border-0 shadow-sm mb-4" style={{
        borderRadius: '12px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1c3654 0%, #2d5f8a 100%)'
      }}>
        <div className="card-body p-4 text-white">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Benvenuto, {user?.name || 'Utente'}!
              </h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem' }}>
                Seleziona un avviso e avvia la simulazione. Il cronometro partira automaticamente.
                Completa tutti i passaggi nel minor tempo possibile per scalare la classifica!
              </p>
              <div className="d-flex" style={{ gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: simulationActive ? '#ffc107' : '#198754',
                    color: simulationActive ? '#333' : 'white',
                    fontSize: '0.85rem', fontWeight: 600,
                    padding: '0.5rem 1.5rem', borderRadius: '6px', border: 'none'
                  }}
                  onClick={handleStartSimulation}
                >
                  {simulationActive ? 'Continua simulazione' : 'Avvia simulazione'}
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white', fontSize: '0.85rem', fontWeight: 600,
                    padding: '0.5rem 1.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)'
                  }}
                  onClick={() => navigateTo('classifica')}
                >
                  Classifica
                </button>
              </div>
            </div>
            <div className="col-md-4 d-none d-md-flex justify-content-center">
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg style={{ width: '48px', height: '48px', fill: 'white' }}>
                  <use href="/sprites.svg#it-presentation" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-1" style={{ fontSize: '1.5rem', fontWeight: '500', color: '#1a1a1a' }}>Dashboard utente</h2>
        <p className="mb-4" style={{ fontSize: '0.85rem', color: '#1a1a1a', lineHeight: '1.4' }}>
          Da questa sezione e' possibile accedere agli avvisi pubblicati relativi al Fondo Sociale Europeo 2021/2027.<br />
          <span style={{ fontSize: '0.75rem' }}>* Gli avvisi con la <svg className="icon icon-sm mx-1" style={{ fill: '#f1c40f', width: '12px', height: '12px', verticalAlign: '-1px' }}><use href="/sprites.svg#it-star-full"></use></svg> identificano quelli per i quali si e' gia avuto accesso.</span>
        </p>

        <div className="row g-3 mb-5">
          {avvisi.map((avviso, i) => (
            <div className="col-12 col-md-6 col-lg-3" key={i}>
              <div className="card shadow-sm h-100 border" style={{ borderColor: '#e9ecef', borderRadius: '4px' }}>
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.5px' }}>PR FSE+ 2021-2027</span>
                    <svg className="icon" style={{ fill: '#f1c40f', width: '14px', height: '14px' }}><use href="/sprites.svg#it-star-full"></use></svg>
                  </div>
                  <div className="d-flex align-items-start mb-4 flex-grow-1">
                    <svg className="icon icon-sm me-2 mt-1" style={{ fill: '#4d5d6d', minWidth: '14px', height: '14px' }}><use href="/sprites.svg#it-info-circle"></use></svg>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a1a1a', lineHeight: '1.3' }}>{avviso.title}</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-decoration-none d-inline-flex align-items-center border-0 bg-transparent p-0"
                      style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0066cc', letterSpacing: '0.5px' }}
                      onClick={handleStartSimulation}
                    >
                      ACCEDI
                      <svg className="icon ms-1" style={{ fill: '#0066cc', width: '12px', height: '12px' }}><use href="/sprites.svg#it-arrow-right"></use></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#333', letterSpacing: '1px' }} className="mb-4">PR FSE+ 2021-2027</h3>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#336699', lineHeight: '1.4', marginBottom: '1.5rem' }}>
            Avviso 7 - Catalogo regionale dell'offerta<br />formativa - Seconda finestra
          </h4>
          <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6', maxWidth: '700px', marginBottom: '3rem' }}>
            Costituzione Catalogo Regionale dell'Offerta Formativa<br />e correlata realizzazione di percorsi formativi di<br />qualificazione mirati al rafforzamento dell'occupabilita<br />in Sicilia
          </p>
          <div>
            <button
              type="button"
              className="text-decoration-none d-inline-flex align-items-center"
              style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0066cc', letterSpacing: '1px', border: 0, background: 'transparent', padding: 0 }}
              onClick={handleStartSimulation}
            >
              {simulationActive ? 'CONTINUA' : 'AVVIA SIMULAZIONE'}
              <svg className="icon ms-1" style={{ fill: '#0066cc', width: '20px', height: '20px', marginLeft: '4px' }}><use href="/sprites.svg#it-arrow-right"></use></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
