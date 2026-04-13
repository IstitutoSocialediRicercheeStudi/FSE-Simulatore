import React from 'react';

/**
 * Campo trappola anti-bot (honeypot).
 * Nascosto via CSS (non display:none, che i bot ignorano).
 * I bot lo compilano; gli utenti umani non lo vedono e lo lasciano vuoto.
 */
function HoneypotField({ onFill }) {
  return (
    <div className="hp-field-wrap" aria-hidden="true" tabIndex={-1}>
      <label htmlFor="hp-cf-extra">Codice di verifica</label>
      <input
        id="hp-cf-extra"
        type="text"
        name="codice_verifica_extra"
        tabIndex={-1}
        autoComplete="off"
        onChange={(e) => {
          if (e.target.value) onFill();
        }}
      />
    </div>
  );
}

export default HoneypotField;
