import React from 'react';
import { useAppData } from '../context/useAppData.js';

const STEPS = [
  { key: 'login', label: 'Accesso', icon: 'it-user' },
  { key: 'role', label: 'Ruolo', icon: 'it-check-circle' },
  { key: 'moduli', label: 'Moduli', icon: 'it-list' },
  { key: 'dettaglio', label: 'Dettaglio P.E.', icon: 'it-pencil' },
  { key: 'partecipanti', label: 'Partecipanti', icon: 'it-team-digitale' },
  { key: 'personale', label: 'Personale', icon: 'it-card' },
  { key: 'verifica', label: 'Verifica e Firma', icon: 'it-check' },
  { key: 'risorse', label: 'Richiesta Risorse', icon: 'it-inbox' },
];

function computeCompletedSteps(user, selectedRole, courses, editionData) {
  const completed = new Set();

  if (user) completed.add('login');
  if (selectedRole) completed.add('role');

  const allEditions = courses.flatMap(c => c.editions);
  const anyNonDraft = allEditions.some(e => e.status !== 'draft');
  const anySigned = allEditions.some(e => e.status === 'signed' || e.status === 'requested');
  const anyRequested = allEditions.some(e => e.status === 'requested');

  // Check if any edition has detail filled
  for (const edId of Object.keys(editionData || {})) {
    const ed = editionData[edId];
    if (ed?.detail?.dataAvvio || ed?.detail?.dataFine) {
      completed.add('dettaglio');
    }
    if (ed?.participants?.length > 0) {
      completed.add('partecipanti');
    }
    if (ed?.staff?.length > 0) {
      completed.add('personale');
    }
  }

  if (anyNonDraft) completed.add('moduli');
  if (anySigned) completed.add('verifica');
  if (anyRequested) completed.add('risorse');

  return completed;
}

function ProgressTracker() {
  const { user, selectedRole, courses } = useAppData();

  // Access portal state for edition data
  const appData = useAppData();
  const editionData = {};
  courses.forEach(course => {
    course.editions.forEach(edition => {
      editionData[edition.id] = appData.getEditionData(edition.id);
    });
  });

  const completed = computeCompletedSteps(user, selectedRole, courses, editionData);
  const completedCount = completed.size;
  const totalSteps = STEPS.length;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  if (!user || !selectedRole) return null;

  return (
    <div className="bg-white border-bottom shadow-sm">
      <div className="container-fluid px-4 py-2">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4d5d6d' }}>
            Progresso simulazione
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: percentage === 100 ? '#198754' : '#0d6efd' }}>
            {percentage}% completato ({completedCount}/{totalSteps})
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: '6px', backgroundColor: '#e9ecef', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: percentage === 100 ? '#198754' : '#0d6efd',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }}
          />
        </div>

        {/* Step indicators */}
        <div className="d-flex justify-content-between" style={{ gap: '2px' }}>
          {STEPS.map((step) => {
            const done = completed.has(step.key);
            return (
              <div
                key={step.key}
                className="text-center"
                style={{ flex: 1 }}
                title={step.label}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: done ? '#198754' : '#e9ecef',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  {done ? (
                    <svg style={{ width: '12px', height: '12px', fill: 'white' }}>
                      <use href="/sprites.svg#it-check" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#6c757d' }}>
                      {STEPS.indexOf(step) + 1}
                    </span>
                  )}
                </div>
                <div className="d-none d-lg-block" style={{ fontSize: '0.58rem', color: done ? '#198754' : '#6c757d', fontWeight: done ? 600 : 400, marginTop: '2px' }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { computeCompletedSteps, STEPS };
export default ProgressTracker;
