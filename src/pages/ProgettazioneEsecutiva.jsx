import React from 'react';
import { useAppData } from '../context/useAppData.js';
import HintBadge from '../components/HintBadge.jsx';

function getCourseProgress(course) {
  const totalEditions = course.editions.length;
  const completed = course.editions.filter((edition) => edition.status !== 'draft').length;
  return { totalEditions, completed };
}

function getModuleStatus(course) {
  const statuses = course.editions.map((edition) => edition.status);
  if (statuses.includes('requested')) return 'requested';
  if (statuses.includes('signed')) return 'signed';
  if (statuses.includes('confirmed')) return 'confirmed';
  return 'draft';
}

function ProgettazioneEsecutiva() {
  const { courses, navigateTo, setActiveSelection } = useAppData();

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <button
            type="button"
            className="btn btn-sm text-white"
            style={{ backgroundColor: '#4caf50', borderRadius: '4px', fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            onClick={() => navigateTo('roles')}
          >
            Cambia soggetto proponente
          </button>
          <h2 className="mt-4 mb-5" style={{ color: '#666', fontWeight: 300, fontSize: '1.8rem', letterSpacing: '1px' }}>
            PROGETTAZIONE ESECUTIVA - FASE 2
          </h2>
        </div>
      </div>

      <div className="row mb-5" style={{ fontSize: '0.85rem' }}>
        <div className="col-md-6">
          <div className="fw-bold text-dark mb-1">Istanza di inserimento al Catalogo (Id: 631)</div>
          <div className="text-dark fw-bold mb-1">Titolo: Catalogo regionale dell'offerta formativa</div>
          <div className="fw-bold mb-3" style={{ color: '#333' }}>
            Dati confermati: istanza trasmessa e disponibile in area documentale.
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn border-0 text-white" style={{ backgroundColor: '#5bc0de', fontSize: '0.8rem', padding: '0.3rem 1rem' }}>
              Visualizza domanda
            </button>
            <button type="button" className="btn border-0 text-white" style={{ backgroundColor: '#e74c3c', fontSize: '0.8rem', padding: '0.3rem 1rem' }}>
              Documenti
            </button>
          </div>
        </div>

        <div className="col-md-6 border-start ps-4" style={{ borderColor: '#ddd' }}>
          <div className="mb-4">
            <div className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 300 }}>Sede legale</div>
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '-4px' }}>Regione Sicilia</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 300 }}>Dati rappresentante legale</div>
            <div className="text-muted border-bottom w-50 pb-1 mb-1 border-light" />
            <div className="text-muted text-end w-50" style={{ fontSize: '0.75rem' }}>Utente dimostrativo</div>
          </div>
        </div>
      </div>

      <div className="mb-2 text-muted d-flex align-items-center" style={{ fontSize: '0.65rem', letterSpacing: '0.5px', gap: '0.4rem' }}>
        Seleziona il corso su cui vuoi compilare la progettazione esecutiva.
        <HintBadge text="Per ogni corso devi prima compilare i Moduli Formativi (icona matita), poi gestire Percorsi e Sedi (icona mappa). Dopo, clicca su un'edizione per compilare il dettaglio della P.E." />
      </div>

      <div className="border shadow-sm bg-white">
        <div className="p-2 d-flex align-items-center text-white" style={{ backgroundColor: '#5890ff', fontSize: '0.9rem' }}>
          <svg className="icon icon-sm icon-white me-2"><use href="/sprites.svg#it-user" /></svg>
          Corsi della proposta formativa ({courses.length})
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0 text-dark" style={{ fontSize: '0.75rem' }}>
            <thead style={{ borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th className="fw-bold border-0 p-3">Id</th>
                <th className="fw-bold border-0 p-3">Titolo</th>
                <th className="fw-bold border-0 p-3">Area professionale</th>
                <th className="fw-bold border-0 p-3">Sottoarea professionale</th>
                <th className="fw-bold border-0 p-3 text-center">Livello EQF</th>
                <th className="fw-bold border-0 p-3 text-center">Nr. Percorsi</th>
                <th className="fw-bold border-0 p-3 text-center">Percorsi confermati</th>
                <th className="fw-bold border-0 p-3 text-center">Moduli</th>
                <th className="fw-bold border-0 p-3 text-center">Percorsi e sedi</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => {
                const firstEdition = course.editions[0] || null;
                const moduleStatus = getModuleStatus(course);
                const { totalEditions, completed } = getCourseProgress(course);

                const moduliColor =
                  moduleStatus === 'requested' ? '#0d6efd'
                    : moduleStatus === 'signed' ? '#5cb85c'
                      : moduleStatus === 'confirmed' ? '#57e112'
                        : '#5890ff';

                return (
                  <tr key={course.id} style={{ backgroundColor: index % 2 !== 0 ? '#f9f9f9' : 'white' }}>
                    <td className="p-3 border-0 align-middle">{course.id}</td>
                    <td className="p-3 border-0 align-middle" style={{ minWidth: '200px' }}>{course.title}</td>
                    <td className="p-3 border-0 align-middle">{course.area}</td>
                    <td className="p-3 border-0 align-middle">{course.sub}</td>
                    <td className="p-3 border-0 align-middle text-center">{course.eqf}</td>
                    <td className="p-3 border-0 align-middle text-center">{totalEditions}</td>
                    <td className="p-3 border-0 align-middle text-center">{completed}</td>
                    <td className="p-3 border-0 align-middle text-center">
                      <button
                        type="button"
                        className="btn border-0 d-inline-flex justify-content-center align-items-center"
                        style={{ backgroundColor: moduliColor, width: '28px', height: '28px', borderRadius: '4px', padding: 0 }}
                        aria-label={`Apri moduli per il corso ${course.id}`}
                        onClick={() => {
                          if (firstEdition) {
                            setActiveSelection({ courseId: course.id, editionId: firstEdition.id });
                          }
                          navigateTo('moduli');
                        }}
                      >
                        <svg style={{ width: '14px', height: '14px', fill: 'white' }}>
                          <use href={moduleStatus === 'draft' ? '/sprites.svg#it-pencil' : '/sprites.svg#it-check'} />
                        </svg>
                      </button>
                    </td>
                    <td className="p-3 border-0 align-middle text-center">
                      <button
                        type="button"
                        className="btn border-0 d-inline-flex justify-content-center align-items-center"
                        style={{ backgroundColor: '#8e44ad', width: '28px', height: '28px', borderRadius: '4px', padding: 0 }}
                        aria-label={`Apri percorsi e sedi per il corso ${course.id}`}
                        onClick={() => {
                          if (firstEdition) {
                            setActiveSelection({ courseId: course.id, editionId: firstEdition.id });
                          }
                          navigateTo('sedi', { courseId: course.id, editionId: firstEdition?.id });
                        }}
                      >
                        <svg style={{ width: '14px', height: '14px', fill: 'white' }}>
                          <use href="/sprites.svg#it-map-marker" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProgettazioneEsecutiva;
