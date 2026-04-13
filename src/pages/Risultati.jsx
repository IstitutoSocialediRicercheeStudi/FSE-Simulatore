import React from 'react';
import { useAppData } from '../context/useAppData.js';
import { computeCompletedSteps, STEPS } from '../components/ProgressTracker.jsx';

function formatTime(ms) {
  if (!ms || ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function formatDate(iso) {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Risultati() {
  const {
    user, selectedRole, courses, navigateTo, getEditionData,
    simulationElapsedMs, simulationActive, getLeaderboard
  } = useAppData();

  const editionData = {};
  courses.forEach(course => {
    course.editions.forEach(edition => {
      editionData[edition.id] = getEditionData(edition.id);
    });
  });

  const completed = computeCompletedSteps(user, selectedRole, courses, editionData);
  const completedCount = completed.size;
  const totalSteps = STEPS.length;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  const allEditions = courses.flatMap(c => c.editions);
  const totalEditions = allEditions.length;
  const requestedEditions = allEditions.filter(e => e.status === 'requested').length;
  const totalParticipants = Object.values(editionData).reduce((sum, ed) => sum + (ed?.participants?.length || 0), 0);
  const totalStaff = Object.values(editionData).reduce((sum, ed) => sum + (ed?.staff?.length || 0), 0);

  // Get this user's completed courses from leaderboard
  const board = getLeaderboard();
  const myResults = user?.name
    ? board.filter(e => e.username === user.name.toLowerCase())
    : [];

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-4">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#1c3654' }}>
          I miei risultati
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
          {user?.name || 'Utente'}
        </p>
      </div>

      {/* Timer corrente */}
      {simulationActive && (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px', borderLeft: '4px solid #dc3545' }}>
          <div className="card-body p-3 d-flex align-items-center justify-content-between">
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 600 }}>Corso in corso - Timer attivo</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1c3654', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(simulationElapsedMs)}
              </div>
            </div>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: '#dc3545', display: 'inline-block',
              animation: 'pulse 1s infinite'
            }} />
          </div>
        </div>
      )}

      {/* Completed courses - main section */}
      {myResults.length > 0 ? (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)',
            padding: '1.5rem 2rem', color: 'white', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{myResults.length}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {myResults.length === 1 ? 'Corso completato' : 'Corsi completati'}
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th className="border-0 p-3">#</th>
                    <th className="border-0 p-3">Corso / Edizione</th>
                    <th className="border-0 p-3 text-center">Miglior Tempo</th>
                    <th className="border-0 p-3 text-center">Tentativi</th>
                    <th className="border-0 p-3 text-center d-none d-md-table-cell">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {myResults.map((entry, i) => (
                    <tr key={entry.key}>
                      <td className="border-0 p-3 align-middle">
                        <span
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            backgroundColor: '#198754', color: 'white',
                            fontSize: '0.7rem', fontWeight: 700
                          }}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="border-0 p-3 align-middle">
                        <div style={{ fontWeight: 600 }}>{entry.editionName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#999' }}>{entry.courseTitle}</div>
                      </td>
                      <td className="border-0 p-3 text-center align-middle">
                        <span style={{ fontWeight: 700, color: '#198754', fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>
                          {formatTime(entry.bestTimeMs)}
                        </span>
                      </td>
                      <td className="border-0 p-3 text-center align-middle">{entry.attempts}</td>
                      <td className="border-0 p-3 text-center align-middle d-none d-md-table-cell" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                        {formatDate(entry.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-body text-center py-4">
            <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Nessun corso completato ancora. Completa un corso e richiedi le risorse per registrare il tempo!
            </div>
          </div>
        </div>
      )}

      {/* Overview edizioni */}
      <div className="row g-3 mb-4">
        {[
          { value: totalEditions, label: 'Edizioni totali', color: '#0d6efd' },
          { value: requestedEditions, label: 'Completate', color: '#198754' },
          { value: totalParticipants, label: 'Partecipanti', color: '#6f42c1' },
          { value: totalStaff, label: 'Personale', color: '#e74c3c' }
        ].map((stat, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px' }}>
              <div className="card-body text-center p-3">
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6c757d', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stato edizioni */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
        <div className="card-body p-3">
          <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1c3654', marginBottom: '1rem' }}>
            Stato edizioni
          </h5>
          <div className="table-responsive">
            <table className="table table-sm mb-0" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                  <th className="border-0 fw-bold">Edizione</th>
                  <th className="border-0 fw-bold text-center">Stato</th>
                  <th className="border-0 fw-bold text-center">Partecipanti</th>
                  <th className="border-0 fw-bold text-center">Personale</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course =>
                  course.editions.map(edition => {
                    const ed = editionData[edition.id] || {};
                    const statusMap = {
                      draft: { bg: '#f8f9fa', text: '#6c757d', label: 'Bozza' },
                      confirmed: { bg: '#e8f5e9', text: '#2e7d32', label: 'Confermata' },
                      signed: { bg: '#e3f2fd', text: '#1565c0', label: 'Firmata' },
                      requested: { bg: '#d4edda', text: '#155724', label: 'Completata' }
                    };
                    const s = statusMap[edition.status] || statusMap.draft;
                    return (
                      <tr key={edition.id}>
                        <td className="border-0 align-middle">
                          <div style={{ fontWeight: 600 }}>{edition.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#999' }}>{course.title}</div>
                        </td>
                        <td className="border-0 align-middle text-center">
                          <span style={{
                            display: 'inline-block', padding: '0.2rem 0.6rem',
                            borderRadius: '12px', fontSize: '0.68rem', fontWeight: 600,
                            backgroundColor: s.bg, color: s.text
                          }}>{s.label}</span>
                        </td>
                        <td className="border-0 align-middle text-center">{ed?.participants?.length || 0}</td>
                        <td className="border-0 align-middle text-center">{ed?.staff?.length || 0}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex flex-wrap justify-content-center" style={{ gap: '0.75rem' }}>
        <button
          type="button"
          className="btn text-white"
          style={{ backgroundColor: '#0d6efd', fontSize: '0.85rem', padding: '0.5rem 1.5rem', borderRadius: '6px' }}
          onClick={() => navigateTo('progettazione')}
        >
          Torna alla Progettazione
        </button>
        <button
          type="button"
          className="btn text-white"
          style={{ backgroundColor: '#6f42c1', fontSize: '0.85rem', padding: '0.5rem 1.5rem', borderRadius: '6px' }}
          onClick={() => navigateTo('classifica')}
        >
          Vedi Classifica
        </button>
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

export default Risultati;
