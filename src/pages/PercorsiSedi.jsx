import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '../context/useAppData.js';

function getStatusBadge(status) {
  if (status === 'requested') {
    return { label: 'Richiesta inviata', bg: '#0d6efd' };
  }
  if (status === 'signed') {
    return { label: 'Firmata', bg: '#4caf50' };
  }
  if (status === 'confirmed') {
    return { label: 'Confermata', bg: '#57e112' };
  }
  return { label: 'Bozza', bg: '#f0ad4e' };
}

function PercorsiSedi() {
  const {
    activeCourseId,
    getActiveCourse,
    navigateTo,
    requestEditionResources,
    setActiveSelection
  } = useAppData();

  const course = getActiveCourse();
  const [requestModal, setRequestModal] = useState({ show: false, editionId: null });
  const [feedback, setFeedback] = useState('');
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (requestModal.show) {
      confirmButtonRef.current?.focus();
    }
  }, [requestModal.show]);

  const confirmRequest = () => {
    const { editionId } = requestModal;
    if (!editionId) return;

    const selectedEdition = course.editions.find((edition) => edition.id === editionId);
    if (selectedEdition?.status !== 'signed') {
      setFeedback('Impossibile inviare la richiesta: la P.E. deve essere prima firmata.');
      setRequestModal({ show: false, editionId: null });
      return;
    }

    requestEditionResources(editionId);
    setFeedback(`Richiesta risorse inviata per il percorso ${editionId}.`);
    setRequestModal({ show: false, editionId: null });
  };

  if (!course) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4">
          <h2 className="h4 text-primary mb-3">Percorsi e sedi</h2>
          <p className="text-muted mb-4">
            Nessun corso selezionato. Torna alla lista corsi e scegli una riga per continuare.
          </p>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary" onClick={() => navigateTo('progettazione')}>
              Vai a Progettazione
            </button>
            {activeCourseId && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigateTo('sedi', { courseId: activeCourseId })}
              >
                Riprova selezione corso
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0" style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div className="bg-white px-4 border-bottom pb-4 mb-4">
        <div className="pt-4 mb-2 d-flex gap-2">
          <button
            type="button"
            className="btn border-0 text-white px-3"
            style={{ backgroundColor: '#4caf50', fontSize: '0.8rem' }}
            onClick={() => navigateTo('progettazione')}
          >
            Torna ai Corsi
          </button>
          <button
            type="button"
            className="btn border-0 text-white px-3"
            style={{ backgroundColor: '#5890ff', fontSize: '0.8rem' }}
            onClick={() => navigateTo('richiesta', { courseId: course.id, editionId: course.editions[0]?.id })}
          >
            Vai a Richiesta risorse
          </button>
        </div>
        <div className="text-center mt-3">
          <div style={{ fontSize: '1.2rem', color: '#666' }}>Sezione Percorsi e sedi - Corso {course.id}</div>
          <div className="text-dark" style={{ fontSize: '0.85rem' }}>{course.title}</div>
        </div>
      </div>

      <div className="px-4 pb-4">
        {feedback && (
          <div className="alert alert-success shadow-sm mb-3" role="status">
            {feedback}
          </div>
        )}

        <div className="mb-2 text-dark" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
          Seleziona una edizione per compilare la P.E. o inviare la richiesta risorse (abilitata solo dopo firma).
        </div>

        <div className="border shadow-sm bg-white">
          <div className="p-2 d-flex align-items-center text-white" style={{ backgroundColor: '#5cb85c', fontSize: '0.9rem' }}>
            <svg className="icon icon-sm icon-white me-2"><use href="/sprites.svg#it-user" /></svg>
            Percorsi della proposta formativa
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-borderless mb-0 text-dark" style={{ fontSize: '0.75rem' }}>
              <thead style={{ borderBottom: '2px solid #dee2e6' }}>
                <tr>
                  <th className="fw-bold p-3">Percorso</th>
                  <th className="fw-bold p-3">Profilo</th>
                  <th className="fw-bold p-3">Ore complessive</th>
                  <th className="fw-bold p-3">Localizzazione sede didattica</th>
                  <th className="fw-bold p-3">Provincia</th>
                  <th className="fw-bold p-3 text-center">Progettazione esecutiva</th>
                  <th className="fw-bold p-3 text-center">Stato P.E.</th>
                  <th className="fw-bold p-3 text-center">Richiesta risorse</th>
                </tr>
              </thead>
              <tbody>
                {course.editions.map((edition) => {
                  const statusBadge = getStatusBadge(edition.status);
                  const canRequest = edition.status === 'signed';
                  const isRequested = edition.status === 'requested';

                  return (
                    <tr key={edition.id} style={{ borderBottom: '1px solid #f1f1f1', backgroundColor: edition.status !== 'draft' ? '#f9fcf9' : 'transparent' }}>
                      <td className="p-3 align-middle text-muted">{edition.id}</td>
                      <td className="p-3 align-middle text-muted">{course.title}</td>
                      <td className="p-3 align-middle text-muted">{edition.hours}</td>
                      <td className="p-3 align-middle text-muted">{edition.address}</td>
                      <td className="p-3 align-middle text-muted">{edition.prov}</td>
                      <td className="p-3 align-middle text-center">
                        <button
                          type="button"
                          className="btn border-0 d-inline-flex justify-content-center align-items-center"
                          style={{
                            backgroundColor: edition.status === 'draft' ? '#5890ff' : '#4caf50',
                            width: '28px',
                            height: '28px',
                            borderRadius: '4px',
                            padding: 0
                          }}
                          aria-label={`Apri dettaglio PE per ${edition.id}`}
                          onClick={() => {
                            setActiveSelection({ courseId: course.id, editionId: edition.id });
                            navigateTo('dettaglioPE', { courseId: course.id, editionId: edition.id });
                          }}
                        >
                          <svg style={{ width: '14px', height: '14px', fill: 'white' }}>
                            <use href={edition.status === 'draft' ? '/sprites.svg#it-pencil' : '/sprites.svg#it-password-visible'} />
                          </svg>
                        </button>
                      </td>
                      <td className="p-3 align-middle text-center">
                        <div className="text-white fw-bold px-3 py-1 d-inline-block shadow-sm" style={{ backgroundColor: statusBadge.bg, borderRadius: '4px', fontSize: '0.7rem' }}>
                          {statusBadge.label}
                        </div>
                      </td>
                      <td className="p-0 align-middle text-center" style={{ width: '220px' }}>
                        {isRequested ? (
                          <button
                            type="button"
                            className="btn text-white w-100 rounded-0 d-flex flex-column justify-content-center align-items-center"
                            style={{ backgroundColor: '#0d6efd', padding: '6px 0', minHeight: '44px' }}
                            onClick={() => navigateTo('richiesta', { courseId: course.id, editionId: edition.id })}
                          >
                            <div className="fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Apri ricevuta</div>
                            <div style={{ fontSize: '0.6rem' }}>
                              Inviata {edition.requestedAt ? new Date(edition.requestedAt).toLocaleString('it-IT') : '-'}
                            </div>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn text-white w-100 rounded-0"
                            style={{
                              backgroundColor: canRequest ? '#d9534f' : '#e5989b',
                              opacity: canRequest ? 1 : 0.8,
                              fontSize: '0.8rem',
                              padding: '12px 0'
                            }}
                            disabled={!canRequest}
                            onClick={() => setRequestModal({ show: true, editionId: edition.id })}
                          >
                            Richiedi
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {requestModal.show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-dialog-title"
        >
          <div className="bg-white rounded-4 shadow py-5 px-4 text-center" style={{ width: '420px', maxWidth: '90%' }}>
            <p id="request-dialog-title" className="text-muted mb-4 px-3" style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>
              Sei sicuro di voler richiedere le risorse per il percorso {requestModal.editionId}?
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                ref={confirmButtonRef}
                type="button"
                className="btn text-white px-4 py-2"
                style={{ backgroundColor: '#387c44', borderRadius: '50px', fontWeight: 600, minWidth: '100px' }}
                onClick={confirmRequest}
              >
                Ok
              </button>
              <button
                type="button"
                className="btn px-4 py-2"
                style={{ backgroundColor: '#d5ebd5', color: '#387c44', borderRadius: '50px', fontWeight: 600, minWidth: '100px' }}
                onClick={() => setRequestModal({ show: false, editionId: null })}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PercorsiSedi;
