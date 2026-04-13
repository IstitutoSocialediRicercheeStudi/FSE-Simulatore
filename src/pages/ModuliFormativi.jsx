import React, { useEffect, useState } from 'react';
import { useAppData } from '../context/useAppData.js';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBotProtection } from '../hooks/useBotProtection.js';
import HoneypotField from '../components/HoneypotField.jsx';

const MOCK_DATA = [
  {
    id: 'MD36402',
    name: "Individuare i bisogni del soggetto valutando le potenzialità di sviluppo e le opportunità di supporto nel contesto di riferimento (famiglia, gruppo classe, scuola, quartiere, ecc.)",
    targetAula: 157,
    targetFAD: 0,
    targetStage: 67,
    knowledges: [
      { id: 'MD148188', name: "Elementi di psicologia generale, di psicologia dello sviluppo e dell'apprendimento e di pedagogia speciale" },
      { id: 'MD148189', name: "Nozioni di psicopatologia dell'età evolutiva, disturbi dello sviluppo e del linguaggio, ritardo mentale, sindromi genetiche" },
      { id: 'MD148190', name: "Principi della comunicazione verbale e non verbale" },
      { id: 'MD148191', name: "Strategie e tecniche di comunicazione di gruppo" },
      { id: 'MD148192', name: "Sistemi internazionali e nazionali di classificazione delle funzionalità e delle disabilità" },
      { id: 'MD148193', name: "Strumento per l'osservazione e la valutazione delle abilità di comunicazione e delle autonomie" },
      { id: 'MD148194', name: "Strumenti per la network analysis" },
      { id: 'MD148195', name: "Tecniche di analisi funzionale dei disturbi comportamentali" },
      { id: 'MD148196', name: "Elementi di anatomia e fisiologia finalizzati all'analisi delle abilità di comunicazione e del livello di autonomia" }
    ]
  },
  {
    id: 'MD36409',
    name: "Interagire con le persone assistite, i membri dell'equipe professionale, i fornitori e i collaboratori esterni",
    targetAula: 75,
    targetFAD: 0,
    targetStage: 100,
    knowledges: [
      { id: 'MD147580', name: "Elementi di sociologia e psicologia socio-relazionale" },
      { id: 'MD147581', name: "Elementi di etica" },
      { id: 'MD147582', name: "Tecniche di analisi della clientela e elementi di customer satisfaction" },
      { id: 'MD147583', name: "Tecniche di negoziazione e problem solving" },
      { id: 'MD147584', name: "Elementi di legislazione socio-sanitaria e del lavoro" },
      { id: 'MD147585', name: "Orientamento al ruolo" }
    ]
  }
];

function ModuliFormativi() {
  const { navigateTo } = useAppData();

  const [hoursData, setHoursData] = useLocalStorage('fse_moduli_hours', {});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState(null);
  const [tempAula, setTempAula] = useState('');
  const [tempFAD, setTempFAD] = useState('');
  const [botError, setBotError] = useState('');

  const { markFormOpen, trackKey, triggerHoneypot, validateSubmit } = useBotProtection();

  // Inizializza il tracciamento ore solo al primo accesso, senza sovrascrivere dati già salvati
  useEffect(() => {
    if (Object.keys(hoursData).length > 0) return;

    const initData = {};
    MOCK_DATA.forEach((comp) => {
      comp.knowledges.forEach((k) => {
        initData[k.id] = { aula: 0, fad: 0 };
      });
    });

    setHoursData(initData);
  }, [hoursData, setHoursData]);

  const openModal = (knowledge) => {
    setActiveKnowledge(knowledge);
    setTempAula(hoursData[knowledge.id]?.aula || 0);
    setTempFAD(hoursData[knowledge.id]?.fad || 0);
    setBotError('');
    setModalOpen(true);
    markFormOpen('moduli');
  };

  const saveModal = () => {
    if (!validateSubmit('moduli')) {
      setBotError('Compilazione automatica rilevata. Inserire i dati manualmente dal browser.');
      return;
    }
    if (activeKnowledge) {
      setHoursData((prev) => ({
        ...prev,
        [activeKnowledge.id]: {
          aula: Number.parseInt(tempAula, 10) || 0,
          fad: Number.parseInt(tempFAD, 10) || 0
        }
      }));
    }
    setModalOpen(false);
  };

  const getCompTotals = (comp) => {
    let totAula = 0, totFAD = 0;
    comp.knowledges.forEach((k) => {
      totAula += (hoursData[k.id]?.aula || 0);
      totFAD += (hoursData[k.id]?.fad || 0);
    });
    return { totAula, totFAD };
  };

  const grandTotals = MOCK_DATA.reduce((acc, comp) => {
    const { totAula, totFAD } = getCompTotals(comp);

    return {
      aula: acc.aula + totAula,
      fad: acc.fad + totFAD,
      stage: acc.stage + comp.targetStage
    };
  }, { aula: 0, fad: 0, stage: 0 });

  const totalAulaTarget = MOCK_DATA.reduce((acc, comp) => acc + comp.targetAula, 0);

  const maxFadAllowed = Math.floor(totalAulaTarget * 0.25);
  const isGrandAulaValid = grandTotals.aula === totalAulaTarget;
  const isGrandFadValid = grandTotals.fad <= maxFadAllowed;

  return (
    <div className="container-fluid px-0" style={{backgroundColor: '#e6eaf0', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"}}>
      
      {/* Header Snippet like in screenshot */}
      <div className="bg-white px-4 border-bottom pb-4 mb-4">
         <div className="d-flex justify-content-between pt-4 mb-2">
            <button className="btn border-0 text-white px-3" style={{backgroundColor: '#4caf50', fontSize: '0.8rem'}} onClick={() => navigateTo('progettazione')}>
              Torna alla lista corsi
            </button>
         </div>
         <div className="text-center mt-3">
            <div style={{fontSize: '1.2rem', color: '#666'}}>Progettazione Esecutiva</div>
            <div style={{fontSize: '0.8rem', fontWeight: 600, color: '#111'}}>Istanza di inserimento al Catalogo: <span className="fw-normal">631</span> Titolo: <span className="fw-normal">PER FORMARE CATALOGO</span></div>
            <div style={{fontSize: '0.85rem', color: '#555', marginTop: '4px'}}>Percorso 5614: Assistente all'autonomia ed alla comunicazione dei disabili</div>
         </div>
      </div>

      <div className="bg-white mx-4 p-4 shadow-sm border">
        {/* Title and bullets */}
        <h5 className="fw-bold text-dark" style={{fontSize: '1.1rem'}}>= Moduli formativi del profilo selezionato</h5>
        <div style={{fontSize: '0.75rem', color: '#444', lineHeight: '1.5'}} className="mb-4 text-dark font-monospace">
          Per poter confermare la domanda occorre:
          <ul className="mb-0 ps-3">
            <li>La durata complessiva delle ore dei moduli, escluse le ore delle competenze trasversali, deve essere pari alle ore aula del percorso.</li>
            <li>La durata complessiva delle ore FAD dei moduli, escluse le competenze trasversali, deve essere pari o inferiore al 25% delle ore aula del percorso.</li>
            <li>La durata complessiva delle ore stage dei moduli deve essere pari alle ore stage del percorso.</li>
          </ul>
        </div>

        {/* Master Table */}
        <div className="table-responsive" style={{fontSize: '0.75rem'}}>
          <table className="table border-0 w-100 mb-0" style={{borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th className="border-0 bg-dark text-white p-2 w-75"></th>
                <th className="border-0 bg-dark text-white p-2 text-center" style={{width: '8%', fontSize: '0.65rem'}}>ORE AULA</th>
                <th className="border-0 bg-dark text-white p-2 text-center" style={{width: '8%', fontSize: '0.65rem'}}>DI CUI IN FAD</th>
                <th className="border-0 bg-dark text-white p-2 text-center" style={{width: '9%', fontSize: '0.65rem'}}>ORE STAGE</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map((comp) => {
                const { totAula, totFAD } = getCompTotals(comp);
                const isConforme = (totAula === comp.targetAula);
                const totBgClass = isConforme ? '#5cb85c' : '#d2322d';

                return (
                  <React.Fragment key={comp.id}>
                    {/* Competence Row */}
                    <tr>
                      <td className="p-2 border-0" style={{backgroundColor: '#4e5d6c', color: 'white', fontWeight: 600}}>
                        <span className="me-3">{comp.id}</span>
                        {comp.name}
                      </td>
                      <td className="p-2 border-0 text-center align-middle bg-white fw-bold">{comp.targetAula}</td>
                      <td className="p-2 border-0 text-center align-middle bg-white fw-bold">{comp.targetFAD}</td>
                      <td className="p-2 border-0 text-center align-middle bg-white fw-bold">{comp.targetStage}</td>
                    </tr>
                    
                    {/* Knowledges Rows */}
                    {comp.knowledges.map((k) => (
                      <tr key={k.id} style={{borderBottom: '1px solid #f1f1f1'}}>
                        <td className="p-2 border-0 bg-white" style={{paddingLeft: '2rem !important'}}>
                          <span style={{color: '#999', marginRight: '0.5rem'}}>↳ {k.id}</span>
                          <span style={{color: '#444'}}>{k.name}</span>
                        </td>
                        <td className="p-2 border-0 text-center align-middle bg-white" style={{color: '#111'}}>{hoursData[k.id]?.aula || 0}</td>
                        <td className="p-2 border-0 text-center align-middle bg-white" style={{color: '#111'}}>{hoursData[k.id]?.fad || 0}</td>
                        <td className="p-0 border-0 text-center align-middle bg-white" style={{width: '40px'}}>
                          <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{paddingRight: '1rem'}}>
                             <button className="btn border-0 d-inline-flex justify-content-center align-items-center" 
                               style={{backgroundColor: '#f0ad4e', width: '22px', height: '22px', borderRadius: '2px', padding: 0}}
                               title="Modifica"
                               onClick={() => openModal(k)}
                             >
                               <svg style={{width: '12px', height: '12px', fill: 'white'}}><use href="/sprites.svg#it-pencil"></use></svg>
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Totals Row */}
                    <tr>
                      <td className="p-2 border-0 text-end" style={{backgroundColor: '#e5e5e5', color: '#111', fontWeight: 600, fontSize: '0.65rem'}}>
                        Totale Modulo {comp.id}
                      </td>
                      <td className="p-2 border-0 text-center align-middle text-white fw-bold" style={{backgroundColor: totBgClass}}>
                        {totAula}
                      </td>
                      <td className="p-2 border-0 text-center align-middle text-white fw-bold" style={{backgroundColor: '#5cb85c'}}>
                        {totFAD}
                      </td>
                      <td className="p-2 border-0 text-center align-middle text-white fw-bold" style={{backgroundColor: '#5cb85c'}}>
                        {comp.targetStage}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
              
              {/* Grand Total Row */}
              <tr>
                <td className="p-3 border-0 text-end border-top" style={{backgroundColor: '#fff', color: '#111', fontWeight: 600, fontSize: '0.75rem'}}>
                  Totale (escluso le competenze trasversali)
                </td>
                <td className="p-3 border-0 text-center align-middle border-top text-white fw-bold" style={{backgroundColor: isGrandAulaValid ? '#5cb85c' : '#d2322d'}}>
                  {grandTotals.aula}
                </td>
                <td className="p-3 border-0 text-center align-middle border-top text-white fw-bold" style={{backgroundColor: isGrandFadValid ? '#5cb85c' : '#d2322d'}}>
                  {grandTotals.fad}
                </td>
                <td className="p-3 border-0 text-center align-middle border-top text-white fw-bold" style={{backgroundColor: '#5cb85c'}}>
                  {grandTotals.stage}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999}}>
          <div className="modal-dialog modal-dialog-centered" style={{maxWidth: '600px'}}>
            <div className="modal-content" style={{borderRadius: '0'}}>
              <div className="modal-header border-bottom-0 py-2">
                <h5 className="modal-title" style={{fontSize: '0.9rem', color: '#888'}}>Modifica modulo</h5>
                <button type="button" className="btn-close" style={{width: '0.5em', height:'0.5em'}} onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body py-1">
                <HoneypotField onFill={triggerHoneypot} />
                {botError && <div className="alert alert-danger mb-2" role="alert" style={{fontSize: '0.82rem'}}>{botError}</div>}
                <div className="mb-3">
                  <label className="form-label" style={{fontSize: '0.7rem', fontWeight: 600, color: '#444', letterSpacing: '0.5px'}}>TITOLO MODULO</label>
                  <input type="text" className="form-control" style={{backgroundColor: '#e9ecef', fontSize: '0.75rem', textTransform: 'uppercase'}} value={activeKnowledge?.name || ''} readOnly disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{fontSize: '0.7rem', fontWeight: 600, color: '#444'}}>ORE AULA</label>
                  <input type="number" className="form-control" style={{fontSize: '0.85rem', borderColor: '#d9534f'}} value={tempAula} onChange={e => setTempAula(e.target.value)} onKeyDown={trackKey} />
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{fontSize: '0.7rem', fontWeight: 600, color: '#444'}}>DI CUI IN FAD</label>
                  <input type="number" className="form-control" style={{fontSize: '0.85rem', borderColor: '#d9534f'}} value={tempFAD} onChange={e => setTempFAD(e.target.value)} onKeyDown={trackKey} />
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0 justify-content-end">
                <button type="button" className="btn border-0 text-white px-4" style={{backgroundColor: '#5890ff', fontSize: '0.85rem'}} onClick={saveModal}>Salva</button>
                <button type="button" className="btn border-0 text-white px-4" style={{backgroundColor: '#f0ad4e', fontSize: '0.85rem'}} onClick={() => setModalOpen(false)}>Annulla</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ModuliFormativi;
