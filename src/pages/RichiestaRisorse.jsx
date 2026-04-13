import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '../context/useAppData.js';

function getStatusChip(status) {
  if (status === 'requested') {
    return <span className="badge rounded-pill bg-primary text-white">Richiesta inviata</span>;
  }
  if (status === 'signed') {
    return <span className="badge rounded-pill bg-success text-white">P.E. firmata</span>;
  }
  if (status === 'confirmed') {
    return <span className="badge rounded-pill" style={{ backgroundColor: '#57e112', color: '#1a1a1a' }}>P.E. confermata</span>;
  }
  return <span className="badge rounded-pill bg-warning text-dark">P.E. non completata</span>;
}

function RichiestaRisorse() {
  const {
    activeEditionId,
    getActiveCourse,
    navigateTo,
    requestEditionResources,
    setActiveSelection
  } = useAppData();

  const course = getActiveCourse();
  const [showModal, setShowModal] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [feedback, setFeedback] = useState('');
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      confirmButtonRef.current?.focus();
    }
  }, [showModal]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(''), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const downloadReceipt = (edition) => {
    const content = [
      'Ricevuta richiesta risorse',
      `Corso: ${course?.title || '-'}`,
      `Edizione: ${edition.name}`,
      `ID edizione: ${edition.id}`,
      `Stato: ${edition.status}`,
      `Data richiesta: ${edition.requestedAt ? new Date(edition.requestedAt).toLocaleString('it-IT') : 'n.d.'}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ricevuta-risorse-${edition.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setFeedback(`Ricevuta scaricata per ${edition.name}.`);
  };

  if (!course) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4">
          <h2 className="h4 text-primary mb-3">Richiesta prenotazione risorse</h2>
          <p className="text-muted mb-4">
            Nessun corso attivo selezionato. Torna ai percorsi per scegliere una edizione e inviare la richiesta.
          </p>
          <div>
            <button type="button" className="btn btn-primary" onClick={() => navigateTo('progettazione')}>
              Vai a Progettazione
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRequest = (edition) => {
    if (edition.status !== 'signed') {
      setFeedback('Per inviare la richiesta devi prima firmare la P.E. della edizione selezionata.');
      return;
    }

    setSelectedEdition(edition);
    setShowModal(true);
  };

  const confirmRequest = () => {
    if (selectedEdition) {
      requestEditionResources(selectedEdition.id);
      setFeedback(`Richiesta inviata per ${selectedEdition.name}.`);
      setShowModal(false);
      setSelectedEdition(null);
    }
  };

  return (
    <div className="container py-5 position-relative">
      <div className="d-flex align-items-center gap-3 mb-5">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigateTo('sedi', { courseId: course.id, editionId: activeEditionId || course.editions[0]?.id || '' })}
        >
          <svg className="icon icon-sm icon-primary me-1"><use href="/sprites.svg#it-arrow-left" /></svg>
          Indietro
        </button>
        <div>
          <h2 className="mb-0 text-primary">Richiesta prenotazione risorse</h2>
          <div className="text-muted small">{course.title}</div>
        </div>
      </div>

      <div className="alert alert-info border-start border-4 border-info shadow-sm mb-5" role="alert">
        <p className="m-0">
          Elenco delle edizioni del corso selezionato con evidenza dello stato della Progettazione Esecutiva.
          E' possibile inviare la richiesta di risorse <strong>solo</strong> per le edizioni con P.E. firmata.
        </p>
      </div>

      {feedback && (
        <div className="alert alert-success shadow-sm mb-4" role="status">
          {feedback}
        </div>
      )}

      <div className="d-flex flex-column gap-4">
        {course.editions.map((edition) => {
          const isSigned = edition.status === 'signed';
          const isRequested = edition.status === 'requested';
          const borderColor = isRequested ? 'border-primary' : (isSigned ? 'border-success' : 'border-warning');

          return (
            <div key={edition.id} className={`card shadow-sm border-start border-4 ${borderColor}`}>
              <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4">
                <div className="mb-3 mb-md-0">
                  <h3 className="h5 mb-2 text-primary">{edition.name}</h3>
                  {getStatusChip(edition.status)}
                  <div className="small text-muted mt-2">{edition.id}</div>
                  {isRequested && edition.requestedAt && (
                    <div className="small text-muted mt-1">
                      Richiesta inviata il {new Date(edition.requestedAt).toLocaleString('it-IT')}
                    </div>
                  )}
                </div>
                <div className="d-flex gap-3">
                  {isRequested ? (
                    <button type="button" className="btn btn-outline-primary" onClick={() => downloadReceipt(edition)}>
                      <svg className="icon icon-sm icon-primary me-2"><use href="/sprites.svg#it-file" /></svg>
                      Scarica ricevuta
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={!isSigned}
                      onClick={() => {
                        setActiveSelection({ courseId: course.id, editionId: edition.id });
                        handleRequest(edition);
                      }}
                    >
                      <svg className="icon icon-sm icon-white me-2"><use href="/sprites.svg#it-upload" /></svg>
                      INVIA RICHIESTA RISORSE
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-request-title"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 id="confirm-request-title" className="modal-title text-primary">Conferma invio richiesta</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Chiudi" />
              </div>
              <div className="modal-body">
                <p>
                  Stai per inviare la richiesta di prenotazione risorse finanziarie per l'edizione:
                  <strong> {selectedEdition?.name}</strong>. Confermi l'operazione?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary" onClick={() => setShowModal(false)}>Annulla</button>
                <button ref={confirmButtonRef} type="button" className="btn btn-primary" onClick={confirmRequest}>OK, INVIA RICHIESTA</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RichiestaRisorse;
