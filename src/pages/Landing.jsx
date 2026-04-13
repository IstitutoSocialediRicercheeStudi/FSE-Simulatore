import React from 'react';
import { useAppData } from '../context/useAppData.js';

function Landing() {
  const { navigateTo } = useAppData();

  return (
    <>
      <section className="it-hero-wrapper it-hero-small-size it-dark it-overlay it-bottom-overlapping-content">
        <div className="img-responsive-wrapper">
          <div className="img-responsive">
            <div className="img-wrapper">
              <img src="/home-hero.jpg" alt="Programma Regionale - Fondo Sociale Europeo 2021/2027" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-hero-text-wrapper bg-dark">
                <span className="it-Categoria">Regione Siciliana</span>
                <h2>Programma Regionale<br/>Fondo Sociale Europeo 2021/2027</h2>
                <p className="d-none d-lg-block">Portale Informativo sui Programmi del Fondo Sociale Europeo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card-wrapper card-space">
              <div className="card card-bg">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-10 offset-lg-1">
                      <h5 className="card-title">Il Fondo Sociale Europeo Plus (FSE+)</h5>
                      <p className="card-text">L'Unione Europea investe sul capitale umano grazie al Fondo Sociale Europeo Plus (FSE+): uno strumento innovativo il cui obiettivo è quello di creare un'Europa sempre più innovativa, verde, sociale, inclusiva e qualificata. Il nuovo ciclo di programmazione 2021-2027 prevede un bilancio complessivo di circa 99 miliardi di euro, rafforzando così le politiche dell'UE.</p>
                      
                      <button type="button" className="read-more text-uppercase fw-bold border-0 bg-transparent p-0" onClick={() => navigateTo('login')}>
                        <span className="text">Accedi al simulatore</span>
                        <svg className="icon"><use href="/sprites.svg#it-arrow-right"></use></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-12 pb-5">
             <div className="row g-4">
                 
                 <div className="col-md-4">
                     <div className="card-wrapper h-100">
                        <div className="card card-img h-100 border-0 shadow-sm">
                             <div className="img-responsive-wrapper">
                                 <div className="img-responsive">
                                     <div className="img-wrapper">
                                         <img src="/news-4.jpg" alt="Avviso 7 - Seconda finestra" />
                                     </div>
                                 </div>
                             </div>
                             <div className="card-body px-3 px-md-4">
                                 <h5 className="card-title mb-2 fs-6 fw-bold">Avviso 7 - Seconda Finestra - PE e prenotazione risorse</h5>
                                 <p className="card-text small text-dark mb-4">Si comunica l'apertura del SI per invio progettazione esecutiva e contestuale prenotazione risorse (procedura a sportello), dalle ore 15:00:00 del 03/10/2025 alle ore 14:59:59 del 07/10/2025. In allegato la guida alla compilazione.</p>
                                 <button
                                   type="button"
                                   className="read-more small mt-auto text-uppercase fw-bold text-primary border-0 bg-transparent p-0"
                                   onClick={() => navigateTo('login')}
                                 >
                                     <span className="text">SCARICA LA GUIDA / ACCEDI</span>
                                     <svg className="icon"><use href="/sprites.svg#it-arrow-right"></use></svg>
                                 </button>
                             </div>
                        </div>
                     </div>
                 </div>
                 
                 <div className="col-md-4">
                     <div className="card-wrapper h-100">
                        <div className="card card-img h-100 border-0 shadow-sm">
                             <div className="img-responsive-wrapper">
                                 <div className="img-responsive">
                                     <div className="img-wrapper">
                                         <img src="/news-1.jpg" alt="Avviso apprendistato" />
                                     </div>
                                 </div>
                             </div>
                             <div className="card-body px-3 px-md-4">
                                 <h5 className="card-title mb-2 fs-6 fw-bold">Avviso apprendistato</h5>
                                 <p className="card-text small text-dark mb-4">Realizzazione di un'offerta formativa in apprendistato di I livello ai sensi dell'art. 43 D.lgs. 81/2015 per gli allievi delle Istituzioni scolastiche statali di II grado</p>
                                 <button
                                   type="button"
                                   className="read-more small mt-auto text-uppercase fw-bold text-primary border-0 bg-transparent p-0"
                                   onClick={() => navigateTo('login')}
                                 >
                                     <span className="text">ACCEDI ALL'AVVISO</span>
                                     <svg className="icon"><use href="/sprites.svg#it-arrow-right"></use></svg>
                                 </button>
                             </div>
                        </div>
                     </div>
                 </div>

                 <div className="col-md-4">
                     <div className="card-wrapper h-100">
                        <div className="card card-img h-100 border-0 shadow-sm">
                             <div className="img-responsive-wrapper">
                                 <div className="img-responsive">
                                     <div className="img-wrapper">
                                         <img src="/news-2.jpg" alt="Avviso incentivi all'assunzione" />
                                     </div>
                                 </div>
                             </div>
                             <div className="card-body px-3 px-md-4">
                                 <h5 className="card-title mb-2 fs-6 fw-bold">Avviso incentivi per l'assunzione</h5>
                                 <p className="card-text small text-dark mb-4">È disposta l'apertura della <b>prima finestra temporale</b> a far data dal <b>18/09/2024</b> dalle ore 09:00 fino alla data del 10/10/2024.<br/>La convalida delle istanze sarà a far data dal <b>18/10/2024</b>...
                                 </p>
                                 <button
                                   type="button"
                                   className="read-more small mt-auto text-uppercase fw-bold text-primary border-0 bg-transparent p-0"
                                   onClick={() => navigateTo('login')}
                                 >
                                     <span className="text">ACCEDI ALL'AVVISO</span>
                                     <svg className="icon"><use href="/sprites.svg#it-arrow-right"></use></svg>
                                 </button>
                             </div>
                        </div>
                     </div>
                 </div>

             </div>
             <div className="d-flex justify-content-center mt-5">
                <div style={{height: '8px', width: '8px', backgroundColor: '#0066cc', borderRadius: '50%', margin: '0 4px', cursor: 'pointer'}}></div>
                <div style={{height: '8px', width: '8px', backgroundColor: '#bfe2ff', borderRadius: '50%', margin: '0 4px', cursor: 'pointer'}}></div>
                <div style={{height: '8px', width: '8px', backgroundColor: '#bfe2ff', borderRadius: '50%', margin: '0 4px', cursor: 'pointer'}}></div>
                <div style={{height: '8px', width: '8px', backgroundColor: '#bfe2ff', borderRadius: '50%', margin: '0 4px', cursor: 'pointer'}}></div>
                <div style={{height: '8px', width: '8px', backgroundColor: '#bfe2ff', borderRadius: '50%', margin: '0 4px', cursor: 'pointer'}}></div>
             </div>
          </div>
        </div>
      </div>

      <section className="mt-3 primary-bg-a1 it-text-centered pb-5" style={{backgroundColor: '#bfe2ff', paddingTop: '3rem'}}>
        <div className="container position-relative">
            <div className="row">
                <div className="col-12 text-center" style={{marginTop: '-4rem'}}>
                    <span className="bg-primary circular d-inline-flex justify-content-center align-items-center" style={{width: '3rem', height: '3rem', borderRadius: '50%', border: '4px solid #bfe2ff'}}>
                        <svg className="icon icon-sm icon-white">
                            <use href="/sprites.svg#it-info-circle"></use>
                        </svg>
                    </span>
                </div>
                <div className="col-12 mt-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mb-4">
                            <div className="card-wrapper">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body py-5 px-md-5">
                                        <h3 className="card-title h4 text-center fw-bold">
                                            Catalogo dell'offerta formativa
                                            <br/><b style={{color:'#d32f2f'}}>RELATIVO ALLA PRIMA FINESTRA 2023</b>
                                        </h3>
                                        <p className="card-text text-center text-dark mt-4 mb-5" style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
                                            Successivamente alla chiusura dell'accreditamento da parte dei soggetti formatori tramite il portale dedicato all'Avviso 7/2023 - PR FSE+ Sicilia 2021/2027, è stato creato un catalogo dell'offerta formativa che raccoglie tutti i corsi disponibili sul territorio siciliano
                                        </p>
                                        <div className="it-btn-container text-center mb-4">
                                            <button className="btn btn-outline-primary fw-bold text-uppercase px-4 py-2" onClick={() => navigateTo('login')}>ACCEDI</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid degli Avvisi (esattamente come nello screenshot) */}
                        {[
                            {title: "Avviso 12/2024 - per l'inserimento socio-lavorativo dei soggetti in esecuzione penale", text: "La formazione prevede la realizzazione di uno o più percorsi formativi, finalizzati al rilascio di una qualifica, di una specializzazione o di un'attestazione delle competenze acquisite"},
                            {title: "Avviso 13/2024 Percorsi IeFP 2024/25 - IV Annualità", text: "Avviso pubblico per la realizzazione di percorsi di istruzione e formazione professionale (IeFP) 2024/25 - IV annualità"},
                            {title: "Avviso 14/2024 - Incentivi all'assunzione", text: "Migliorare l'accesso all'occupazione e le misure di attivazione per tutte le persone in cerca di lavoro"},
                            {title: "Avviso 16/2024 IeFP 2024/27 - Triennio", text: "Avviso pubblico per la realizzazione di percorsi di istruzione e formazione professionale (IeFP) 2024/27 - Triennio"},
                            {title: "Avviso 18/2024 - Apprendistato", text: "Individuazione di un catalogo e sostegno alla realizzazione di un'offerta formativa in apprendistato di I livello..."},
                            {title: "Avviso 20/2024 - Assistenti familiari", text: "Avviso per la realizzazione di percorsi per la formazione di assistenti familiari"},
                            {title: "Avviso 24/2024 - Servizi di prossimità", text: "Sviluppo di servizi di prossimità sociale e cura"},
                            {title: "Avviso 26/2025 IeFP 2025/28 - Triennio", text: "Avviso pubblico per la realizzazione di percorsi di istruzione..."},
                            {title: "Avviso n. 25/2024 – Percorsi sociali per il lavoro - Interventi di presa in carico multiprofessionale finalizzata all’inclusione lavorativa delle persone con disabilità", text: "Percorsi Sociali per il Lavoro Interventi di presa in carico multiprofessionale... "},
                            {title: "Avviso occupazione donna", text: "Misure volte a promuovere la partecipazione delle donne al mercato del lavoro... "},
                            {title: "Avviso Pubblico IeFP 2022/25 - III Annualità", text: "Avviso pubblico per la realizzazione di percorsi di istruzione e formazione professionale (IeFP)..."}
                        ].map((avviso, idx) => (
                            <div className="col-lg-4 mb-4" key={idx}>
                                <div className="card-wrapper h-100">
                                    <div className="card shadow-sm border-0 h-100">
                                        <div className="card-body d-flex flex-column position-relative pt-4 pb-4 px-4">
                                            <svg className="icon icon-sm icon-secondary position-absolute top-0 end-0 mt-2 me-2">
                                                <use href="/sprites.svg#it-info-circle"></use>
                                            </svg>
                                            <h3 className="card-title h6 fw-bold mb-3 pe-4 text-start">{avviso.title}</h3>
                                            <button
                                              type="button"
                                              className="read-more mt-auto text-primary text-uppercase fw-bold text-start border-0 bg-transparent p-0"
                                              onClick={() => navigateTo('login')}
                                              style={{fontSize:'0.75rem'}}
                                            >
                                                <span className="text">Accedi</span>
                                                <svg className="icon"><use href="/sprites.svg#it-arrow-right"></use></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="col-lg-12 mt-4 mb-4">
                            <h4 className="text-secondary text-center fw-bold" style={{color: '#435a70'}}>Contenuti con autenticazione dedicata</h4>
                        </div>

                        {[
                            {title: "Avviso 10 - Scuole aperte per il territorio", action: "ACCEDI AL PORTALE DEDICATO", linkIcon: "it-external-link"},
                            {title: "Catalogo offerta formativa", action: "ACCEDI AL PORTALE DEDICATO", linkIcon: "it-external-link"}
                        ].map((authContent, idx) => (
                            <div className="col-lg-6 mb-4" key={idx}>
                                <div className="card-wrapper h-100">
                                    <div className="card shadow-sm border-0 h-100">
                                        <div className="card-body position-relative pt-4 pb-4 px-4">
                                            <svg className="icon icon-sm icon-secondary position-absolute top-0 end-0 mt-2 me-2">
                                                <use href="/sprites.svg#it-info-circle"></use>
                                            </svg>
                                            <h3 className="card-title h6 fw-bold mb-3 pe-4 text-start">{authContent.title}</h3>
                                            <button
                                              type="button"
                                              className="read-more mt-auto text-primary text-uppercase fw-bold text-start border-0 bg-transparent p-0"
                                              onClick={() => navigateTo('login')}
                                              style={{fontSize:'0.75rem'}}
                                            >
                                                <span className="text">{authContent.action}</span>
                                                <svg className="icon"><use href={`/sprites.svg#${authContent.linkIcon}`}></use></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
