import React from 'react';
import { useAppData } from '../context/useAppData.js';

function formatTimer(ms) {
  const totalMs = Math.max(0, Math.floor(ms));
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
}

function Header() {
  const {
    user, selectedRole, navigateTo, logout,
    simulationActive, simulationElapsedMs,
    startSimulation, pauseSimulation
  } = useAppData();

  const selectedRoleLabel = selectedRole?.name || 'Ruolo selezionato';

  return (
    <div className="it-header-center-wrapper it-small-header theme-light header-theme-white shadow-sm" style={{ borderTop: '8px solid #3a3b45' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="it-header-center-content-wrapper py-3">
              <div className="it-brand-wrapper">
                <button
                  type="button"
                  className="d-flex align-items-center text-decoration-none border-0 bg-transparent p-0"
                  onClick={() => navigateTo('landing')}
                >
                  <img src="/logo-regione-siciliana.png" alt="Regione Siciliana" style={{ height: '3.6rem', marginRight: '1.2rem' }} />
                  <div className="it-brand-text text-start" style={{ marginTop: '0.2rem', color: '#1c3654' }}>
                    <div className="it-brand-title mb-0" style={{ fontSize: '1.6rem', fontWeight: 500, letterSpacing: '0.5px' }}>PR FSE+ 2021-2027</div>
                    <div className="it-brand-tagline d-none d-md-block" style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#4d5d6d', borderTop: '1px solid #d4d9de', paddingTop: '0.15rem', marginTop: '0.15rem' }}>
                      Simulatore di Formazione
                    </div>
                  </div>
                </button>
              </div>
              <div className="it-right-zone">
                <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                  {/* Classifica - always visible */}
                  <button
                    type="button"
                    className="text-decoration-none d-flex align-items-center border-0 bg-transparent p-0"
                    style={{ color: '#FFD700' }}
                    onClick={() => navigateTo('classifica')}
                  >
                    <svg className="icon icon-sm me-1" style={{ fill: '#FFD700' }}><use href="/sprites.svg#it-star-full"></use></svg>
                    <span className="d-none d-lg-block" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1c3654' }}>Classifica</span>
                  </button>

                  {!user ? (
                    <button
                      type="button"
                      className="text-decoration-none d-flex align-items-center border-0 bg-transparent p-0"
                      style={{ color: '#1c3654' }}
                      onClick={() => navigateTo('login')}
                    >
                      <svg className="icon icon-sm me-2" style={{ fill: '#1c3654' }}><use href="/sprites.svg#it-user"></use></svg>
                      <span className="d-none d-lg-block" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Accedi</span>
                    </button>
                  ) : (
                    <>
                      {/* User name */}
                      <div className="d-flex align-items-center" style={{ gap: '0.3rem' }}>
                        <svg className="icon icon-sm" style={{ fill: '#4d5d6d' }}><use href="/sprites.svg#it-user"></use></svg>
                        <span className="d-none d-lg-block" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1c3654' }}>{user.name}</span>
                      </div>

                      {/* Role badge */}
                      {selectedRole && (
                        <div className="d-none d-xl-block px-2 py-1 rounded bg-light text-truncate" style={{ maxWidth: '180px', fontSize: '0.65rem', color: '#465464' }} title={selectedRoleLabel}>
                          {selectedRoleLabel}
                        </div>
                      )}

                      {/* Simulation Timer - only visible after simulation started */}
                      {selectedRole && (simulationActive || simulationElapsedMs > 0) && (
                        <div className="d-flex align-items-center px-2 py-1 rounded border" style={{
                          gap: '0.4rem',
                          backgroundColor: simulationActive ? '#f0fff4' : '#fff',
                          borderColor: simulationActive ? '#198754' : '#dee2e6'
                        }}>
                          {/* Pulsating dot when active */}
                          {simulationActive && (
                            <span style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              backgroundColor: '#dc3545', display: 'inline-block',
                              animation: 'pulse 1s infinite'
                            }} />
                          )}
                          <span style={{
                            fontSize: '0.85rem', fontWeight: 700, color: '#1c3654',
                            fontVariantNumeric: 'tabular-nums', minWidth: '70px', textAlign: 'center'
                          }}>
                            {formatTimer(simulationElapsedMs)}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm text-white"
                            style={{
                              backgroundColor: simulationActive ? '#dc3545' : '#198754',
                              fontSize: '0.65rem', padding: '0.15rem 0.5rem',
                              fontWeight: 600, border: 'none', borderRadius: '4px'
                            }}
                            onClick={simulationActive ? pauseSimulation : startSimulation}
                          >
                            {simulationActive ? 'Pausa' : 'Avvia'}
                          </button>
                        </div>
                      )}

                      {/* Results */}
                      <button
                        type="button"
                        className="text-decoration-none d-flex align-items-center border-0 bg-transparent p-0"
                        style={{ color: '#0d6efd' }}
                        onClick={() => navigateTo('risultati')}
                      >
                        <svg className="icon icon-sm me-1" style={{ fill: '#0d6efd' }}><use href="/sprites.svg#it-chart-line"></use></svg>
                        <span className="d-none d-lg-block" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Risultati</span>
                      </button>

                      {/* Logout */}
                      <button
                        type="button"
                        className="text-decoration-none d-flex align-items-center border-0 bg-transparent p-0"
                        style={{ color: '#4d5d6d' }}
                        onClick={logout}
                      >
                        <svg className="icon icon-sm me-1" style={{ fill: '#4d5d6d', transform: 'rotate(180deg)' }}><use href="/sprites.svg#it-sign-out"></use></svg>
                        <span className="d-none d-lg-block" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Esci</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default Header;
