import React from 'react';

function Footer() {
  return (
    <>
      <section className="mt-3 bg-white it-text-centered border-top">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 py-5 ps-md-5 pe-md-5">
              <h4 className="text-secondary mb-4">FSE+ in Sicilia</h4>
              <p className="card-text text-dark" style={{fontSize: '0.9rem'}}>
                La Regione Siciliana potrà contare su una dotazione di <b>oltre 1,5 miliardi di euro</b> per la Programmazione 2021-2027. FSE+ in Sicilia è lo strumento con cui realizzare:
              </p>
              <ul className="text-dark small lh-lg">
                <li>un contesto sociale sempre più equo ed inclusivo;</li>
                <li>un incremento dell'occupazione tramite strumenti che facilitino l'accesso nel mondo del lavoro (in particolar modo per i giovani e le donne);</li>
                <li>una maggiore qualificazione e specializzazione delle figure professionali;</li>
                <li>politiche sociali innovative;</li>
                <li>una partecipazione attiva alla vita economica, sociale e collettiva.</li>
              </ul>
            </div>
            <div className="col-12 col-md-6 py-5 ps-md-5 pe-md-5">
              <h4 className="text-secondary mb-4">Le Priorità</h4>
              <p className="card-text text-dark" style={{fontSize: '0.9rem'}}>
                La strategia del Programma Regionale FSE+ 2021-2027<br/>si articola sulle seguenti priorità:
              </p>
              <ul className="text-dark small lh-lg">
                <li>Occupazione;</li>
                <li>Istruzione e formazione;</li>
                <li>Inclusione sociale;</li>
                <li>Giovani;</li>
                <li>Azioni sociali innovative;</li>
                <li>Assistenza Tecnica.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="it-footer">
        <div className="it-footer-small-prints" style={{backgroundColor: '#eef2f5'}}>
          <div className="container-fluid">
            <section className="p-5">
              <div className="row">

                <div className="col-lg-4 col-md-4 pb-2 text-secondary">
                  <h4 className="h5 fw-bold mb-3 text-dark">Regione Siciliana</h4>
                  <p className="small text-muted">
                    Codice fiscale: 80012000826<br/>
                    P. IVA: 02711070827
                  </p>
                </div>

                <div className="col-lg-4 col-md-4 pb-2 text-secondary">
                  <h4 className="h5 fw-bold mb-3 text-dark">Contatti</h4>
                  <p className="small text-muted">
                    <span className="text-secondary d-block mb-1">
                      Posta Elettronica Certificata
                    </span>
                    <span className="text-secondary d-block">
                      URP - Ufficio Relazioni con il Pubblico
                    </span>
                  </p>
                </div>

                <div className="col-lg-4 col-md-4 pb-2 text-secondary">
                  <div className="pb-5">
                    <h4 className="h5 fw-bold mb-3 text-dark">Note legali</h4>
                    <p className="small text-muted">
                      <span className="text-secondary d-block mb-1">
                        Note legali
                      </span>
                      <span className="text-secondary d-block">
                        Privacy policy
                      </span>
                    </p>
                  </div>
                </div>

                <div className="col-12 py-4 mt-3 text-center border-top">
                  <img src="/coesione-italia.svg" alt="Coesione Italia" className="px-3" style={{height:'3.5rem'}} />
                  <img src="/UE.svg" alt="Unione Europea" className="px-3" style={{height:'3.5rem'}} />
                  <img src="/logo-regione-siciliana.png" alt="Regione Siciliana" className="px-3" style={{height:'3.5rem'}} />
                </div>

              </div>
            </section>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
