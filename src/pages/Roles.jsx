import React from 'react';
import { useAppData } from '../context/useAppData.js';

function Roles() {
  const { selectRole } = useAppData();

  const mockRoles = [
    { id: '1', name: 'OFFICINA FORMATIVA (HE...6)', type: 'Legale rappresentante' },
    { id: '2', name: '...TER (A...7)', type: 'Legale rappresentante' },
    { id: '3', name: 'POLO UNIVERSITARIO SRL (JA...B)', type: 'Legale rappresentante' },
    { id: '4', name: 'CO... GELA (A... 3)', type: 'Legale rappresentante' }
  ];

  return (
    <div className="container py-4 d-flex flex-column" style={{minHeight: '80vh'}}>
      <div className="flex-grow-1">
        <h2 className="mb-0" style={{fontSize: '2rem', fontWeight: 300, color: '#1a1a1a'}}>Seleziona ruolo da assumere</h2>
        <p className="mb-4" style={{fontSize: '0.9rem', color: '#c0392b', fontWeight: 500}}>
          Attenzione! Sono visualizzati tutti gli Enti per i quali è autorizzato l'accesso tranne quelli accreditati per attività auto-finanziate
        </p>

        <div className="card shadow-sm border" style={{borderColor: '#e9ecef', borderRadius: '4px'}}>
          <div className="card-body p-4">
            <h3 className="h6 mb-3 fw-bold" style={{color: '#1a1a1a'}}>Legale rappresentante</h3>
            <ul className="mb-0 ps-4" style={{lineHeight: '2'}}>
              {mockRoles.map(role => (
                <li key={role.id}>
                  <button
                    type="button"
                    className="text-decoration-none" 
                    style={{color: '#1a1a1a', fontSize: '0.9rem', border: 0, background: 'transparent', padding: 0}}
                    onClick={() => selectRole(role)}
                  >
                    {role.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 pt-5 pb-3">
        <p style={{fontSize: '0.75rem', fontWeight: 600, color: '#1a1a1a', lineHeight: '1.4'}}>
          Avviso n.7/2023 ©Regione Siciliana, Assessorato Regionale dell'Istruzione e della Formazione Professionale, Dipartimento Regionale della Formazione Professionale<br/>
          PR FSE+ Sicilia 2021/2027 - Codice Fiscale 80012000826 - Partita Iva 02711070827
        </p>
      </div>
    </div>
  );
}

export default Roles;
