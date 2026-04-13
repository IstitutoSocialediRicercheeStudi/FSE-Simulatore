import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/useAppData.js';

function formatTime(ms) {
  if (!ms || ms <= 0) return '--:--';
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

function Classifica() {
  const { navigateTo, getLeaderboard, user } = useAppData();
  const [board, setBoard] = useState([]);
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    setBoard(getLeaderboard());
    const interval = setInterval(() => setBoard(getLeaderboard()), 5000);
    return () => clearInterval(interval);
  }, [getLeaderboard]);

  // Get unique courses from board
  const courseOptions = [];
  const seenCourses = new Set();
  board.forEach(entry => {
    if (entry.courseId && !seenCourses.has(entry.courseId)) {
      seenCourses.add(entry.courseId);
      courseOptions.push({ id: entry.courseId, title: entry.courseTitle });
    }
  });

  // Filter and sort
  const filtered = filterCourse === 'all'
    ? [...board].sort((a, b) => a.bestTimeMs - b.bestTimeMs)
    : board.filter(e => e.courseId === filterCourse).sort((a, b) => a.bestTimeMs - b.bestTimeMs);

  const getMedalStyle = (index) => {
    if (index === 0) return { bg: 'linear-gradient(135deg, #FFD700, #FFA000)', color: '#7B5800' };
    if (index === 1) return { bg: 'linear-gradient(135deg, #C0C0C0, #9E9E9E)', color: '#4A4A4A' };
    if (index === 2) return { bg: 'linear-gradient(135deg, #CD7F32, #A0522D)', color: '#4A2600' };
    return { bg: '#e9ecef', color: '#6c757d' };
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          <svg style={{ width: '48px', height: '48px', fill: '#FFD700' }}>
            <use href="/sprites.svg#it-star-full" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1c3654' }}>
          Classifica Generale
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
          I migliori tempi di completamento per corso
        </p>
      </div>

      {/* Course filter */}
      {courseOptions.length > 0 && (
        <div className="d-flex justify-content-center mb-4">
          <div className="d-flex flex-wrap justify-content-center" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                backgroundColor: filterCourse === 'all' ? '#1c3654' : '#e9ecef',
                color: filterCourse === 'all' ? 'white' : '#333',
                fontSize: '0.75rem', fontWeight: 600, borderRadius: '20px',
                padding: '0.3rem 1rem', border: 'none'
              }}
              onClick={() => setFilterCourse('all')}
            >
              Tutti i corsi
            </button>
            {courseOptions.map(c => (
              <button
                key={c.id}
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: filterCourse === c.id ? '#1c3654' : '#e9ecef',
                  color: filterCourse === c.id ? 'white' : '#333',
                  fontSize: '0.75rem', fontWeight: 600, borderRadius: '20px',
                  padding: '0.3rem 1rem', border: 'none',
                  maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}
                onClick={() => setFilterCourse(c.id)}
                title={c.title}
              >
                {c.title.length > 30 ? c.title.substring(0, 30) + '...' : c.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-body text-center py-5">
            <svg style={{ width: '48px', height: '48px', fill: '#dee2e6', marginBottom: '1rem' }}>
              <use href="/sprites.svg#it-list" />
            </svg>
            <h5 style={{ color: '#6c757d', fontWeight: 500 }}>Nessun risultato ancora</h5>
            <p style={{ fontSize: '0.85rem', color: '#adb5bd' }}>
              Completa un corso (richiedi le risorse) per apparire in classifica!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="row g-3 mb-4 justify-content-center">
            {filtered.slice(0, 3).map((entry, i) => {
              const medal = getMedalStyle(i);
              const isCurrentUser = user?.name?.toLowerCase() === entry.username;
              return (
                <div className="col-12 col-md-4" key={entry.key}>
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                      borderRadius: '12px',
                      outline: isCurrentUser ? '2px solid #0d6efd' : 'none',
                      transform: i === 0 ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <div className="card-body text-center p-3">
                      <div
                        className="d-inline-flex align-items-center justify-content-center mb-2"
                        style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: medal.bg, color: medal.color,
                          fontSize: '1.2rem', fontWeight: 800
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1c3654' }}>
                        {entry.displayName}
                        {isCurrentUser && <span style={{ fontSize: '0.65rem', color: '#0d6efd', marginLeft: '0.3rem' }}>(tu)</span>}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6c757d', marginTop: '0.2rem' }}>
                        {entry.editionName}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: i === 0 ? '#198754' : '#333', marginTop: '0.3rem' }}>
                        {formatTime(entry.bestTimeMs)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#999', marginTop: '0.1rem' }}>
                        {entry.attempts} {entry.attempts === 1 ? 'tentativo' : 'tentativi'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full table */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th className="border-0 p-3 text-center" style={{ width: '55px' }}>#</th>
                      <th className="border-0 p-3">Nome</th>
                      <th className="border-0 p-3">Corso / Edizione</th>
                      <th className="border-0 p-3 text-center">Tempo</th>
                      <th className="border-0 p-3 text-center">Tentativi</th>
                      <th className="border-0 p-3 text-center d-none d-md-table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry, index) => {
                      const isCurrentUser = user?.name?.toLowerCase() === entry.username;
                      return (
                        <tr
                          key={entry.key}
                          style={{ backgroundColor: isCurrentUser ? '#e8f4fd' : 'transparent' }}
                        >
                          <td className="border-0 p-3 text-center align-middle">
                            <span
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: getMedalStyle(index).bg, color: getMedalStyle(index).color,
                                fontSize: '0.72rem', fontWeight: 700
                              }}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="border-0 p-3 align-middle">
                            <span style={{ fontWeight: 600 }}>{entry.displayName}</span>
                            {isCurrentUser && <span className="badge bg-primary ms-2" style={{ fontSize: '0.58rem' }}>Tu</span>}
                          </td>
                          <td className="border-0 p-3 align-middle">
                            <div style={{ fontWeight: 500, fontSize: '0.78rem' }}>{entry.editionName}</div>
                            <div style={{ fontSize: '0.68rem', color: '#999' }}>{entry.courseTitle}</div>
                          </td>
                          <td className="border-0 p-3 text-center align-middle">
                            <span style={{ fontWeight: 700, color: '#198754', fontVariantNumeric: 'tabular-nums' }}>
                              {formatTime(entry.bestTimeMs)}
                            </span>
                          </td>
                          <td className="border-0 p-3 text-center align-middle">{entry.attempts}</td>
                          <td className="border-0 p-3 text-center align-middle d-none d-md-table-cell" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            {formatDate(entry.completedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="d-flex justify-content-center mt-4" style={{ gap: '1rem' }}>
        {user ? (
          <button
            type="button"
            className="btn text-white"
            style={{ backgroundColor: '#0d6efd', fontSize: '0.85rem', padding: '0.5rem 1.5rem', borderRadius: '6px' }}
            onClick={() => navigateTo('dashboard')}
          >
            Torna alla Dashboard
          </button>
        ) : (
          <button
            type="button"
            className="btn text-white"
            style={{ backgroundColor: '#0d6efd', fontSize: '0.85rem', padding: '0.5rem 1.5rem', borderRadius: '6px' }}
            onClick={() => navigateTo('login')}
          >
            Accedi per iniziare
          </button>
        )}
      </div>
    </div>
  );
}

export default Classifica;
