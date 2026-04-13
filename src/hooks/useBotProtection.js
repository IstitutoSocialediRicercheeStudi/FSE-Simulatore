import { useEffect, useRef, useCallback } from 'react';

/**
 * Anti-bot protection hook.
 *
 * Tecniche usate (senza CAPTCHA):
 *  1. navigator.webdriver    – blocca Selenium, Playwright, Puppeteer
 *  2. Honeypot field         – campo nascosto CSS; i bot lo compilano, gli umani no
 *  3. Interazione reale      – almeno un evento mouse/touch prima del salvataggio
 *  4. Timing minimo          – il form deve essere aperto almeno MIN_MS prima del salvataggio
 *  5. Velocità di digitazione – chiavi digitate troppo velocemente in sequenza = bot
 *  6. event.isTrusted        – intercetta e blocca QUALSIASI estensione/script che usa
 *                              dispatchEvent() (incluso il bot FSE Autofill)
 *
 * Meccanismo chiave — event.isTrusted:
 *  - Gli eventi generati dall'utente reale hanno isTrusted = true
 *  - Gli eventi generati via dispatchEvent() (qualunque estensione) hanno isTrusted = false
 *  - Ascoltiamo in fase CAPTURE su document → vediamo l'evento PRIMA di React e di chiunque altro
 *  - stopImmediatePropagation() blocca la propagazione → React non aggiorna mai lo stato
 *  - Ripristiniamo il valore originale con il native setter (invisibile a React)
 */

const MIN_FORM_OPEN_MS = 1200;
const MIN_KEY_INTERVAL_MS = 35;
const BOT_KEY_THRESHOLD = 6;

const REASON_MESSAGES = {
  webdriver: {
    title: '⛔ Accesso automatizzato bloccato',
    body: 'È stato rilevato uno strumento di automazione browser (WebDriver). L\'accesso è negato.'
  },
  honeypot: {
    title: '⚠️ Attività sospetta bloccata',
    body: 'Rilevato tentativo di compilazione automatica dei campi. Operazione annullata.'
  },
  keys_too_fast: {
    title: '⚠️ Digitazione anomala rilevata',
    body: 'La velocità di digitazione supera i limiti umani. Operazione bloccata.'
  },
  no_interaction: {
    title: '⚠️ Nessuna interazione reale',
    body: 'Non è stata rilevata alcuna interazione umana (mouse/touch). Operazione bloccata.'
  },
  extension_inject: {
    title: '🚫 Estensione browser bloccata',
    body: 'Rilevato e bloccato un tentativo di compilazione automatica tramite estensione browser. I campi sono stati ripristinati.'
  }
};

function dispatchBotAlert(reason) {
  const info = REASON_MESSAGES[reason];
  if (!info) return;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(info.title, {
        body: info.body,
        icon: '/logo-regione-siciliana.png',
        tag: 'bot-alert',
        requireInteraction: false
      });
    } catch {
      // ignorare: alcune piattaforme bloccano silenziosamente
    }
  }

  window.dispatchEvent(new CustomEvent('bot-alert', {
    detail: { reason, title: info.title, body: info.body }
  }));
}

export function useBotProtection() {
  const hasRealInteraction = useRef(false);
  const honeypotFilled = useRef(false);
  const formOpenTimes = useRef({});
  const keyTimestamps = useRef([]);

  // ── 1. Richiedi permesso notifiche ──────────────────────────────────────
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // ── 2. Interazione reale (mouse / touch) ────────────────────────────────
  useEffect(() => {
    const onMove = () => { hasRealInteraction.current = true; };
    const onTouch = () => { hasRealInteraction.current = true; };
    window.addEventListener('mousemove', onMove, { passive: true, once: true });
    window.addEventListener('touchstart', onTouch, { passive: true, once: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  // ── 3. Blocco estensioni via event.isTrusted ─────────────────────────────
  // DISABLED in dev/test mode — stealth.js handles isTrusted in production.
  // This was blocking the bot from filling fields on the test simulator.
  useEffect(() => {
    // DEV MODE: skip all event blocking
    if (import.meta.env.DEV) return;
    // Cache dei valori originali prima che l'estensione li sovrascriva
    const originalValues = new WeakMap();

    // Cooldown per evitare notifiche spam (max 1 ogni 2s)
    let alertCooldown = false;
    const alertOnce = (reason) => {
      if (alertCooldown) return;
      alertCooldown = true;
      dispatchBotAlert(reason);
      setTimeout(() => { alertCooldown = false; }, 2000);
    };

    // Traccia il valore al momento del focus (prima di modifiche esterne)
    const onFocus = (event) => {
      const el = event.target;
      if (!el || !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      originalValues.set(el, el.value);
    };

    // Blocca eventi 'input' non trusted (text/email/number inputs, textarea)
    const onInput = (event) => {
      if (event.isTrusted) return;
      const el = event.target;
      if (!el || !['INPUT', 'TEXTAREA'].includes(el.tagName)) return;

      // Ripristina il valore usando il native setter (invisibile a React)
      const proto = el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (nativeSetter) {
        nativeSetter.call(el, originalValues.get(el) ?? '');
      }

      // Blocca la propagazione → React non vede l'evento, lo stato non cambia
      event.stopImmediatePropagation();
      alertOnce('extension_inject');
    };

    // Blocca eventi 'change' non trusted (select, checkbox, radio via change)
    const onChange = (event) => {
      if (event.isTrusted) return;
      const el = event.target;
      if (!el) return;

      // Ripristina il valore del select
      if (el.tagName === 'SELECT') {
        el.value = originalValues.get(el) ?? '';
      }

      event.stopImmediatePropagation();
      alertOnce('extension_inject');
    };

    // Blocca click non trusted su radio, checkbox e pulsanti
    // (il bot usa radio.click() per selezionare opzioni)
    const onClick = (event) => {
      if (event.isTrusted) return;
      const el = event.target;
      if (!el) return;

      const tag = el.tagName;
      const type = (el.type || '').toLowerCase();

      if (tag === 'BUTTON' || type === 'radio' || type === 'checkbox' || type === 'submit') {
        event.stopImmediatePropagation();
        event.preventDefault();
        alertOnce('extension_inject');
      }
    };

    document.addEventListener('focus', onFocus, { capture: true });
    document.addEventListener('input', onInput, { capture: true });
    document.addEventListener('change', onChange, { capture: true });
    document.addEventListener('click', onClick, { capture: true });

    return () => {
      document.removeEventListener('focus', onFocus, { capture: true });
      document.removeEventListener('input', onInput, { capture: true });
      document.removeEventListener('change', onChange, { capture: true });
      document.removeEventListener('click', onClick, { capture: true });
    };
  }, []);

  // ── API pubblica ──────────────────────────────────────────────────────────

  const markFormOpen = useCallback((formId) => {
    formOpenTimes.current[formId] = Date.now();
    keyTimestamps.current = [];
  }, []);

  const trackKey = useCallback(() => {
    const now = Date.now();
    keyTimestamps.current.push(now);
    if (keyTimestamps.current.length > 30) keyTimestamps.current.shift();
  }, []);

  const triggerHoneypot = useCallback(() => {
    honeypotFilled.current = true;
    dispatchBotAlert('honeypot');
  }, []);

  const validateSubmit = useCallback((formId) => {
    if (typeof navigator !== 'undefined' && navigator.webdriver) {
      dispatchBotAlert('webdriver');
      return false;
    }
    if (honeypotFilled.current) return false;
    if (!hasRealInteraction.current) {
      dispatchBotAlert('no_interaction');
      return false;
    }

    const keys = keyTimestamps.current;
    if (keys.length >= BOT_KEY_THRESHOLD) {
      let fastCount = 0;
      for (let i = 1; i < keys.length; i++) {
        if (keys[i] - keys[i - 1] < MIN_KEY_INTERVAL_MS) fastCount++;
        else fastCount = 0;
        if (fastCount >= BOT_KEY_THRESHOLD) {
          dispatchBotAlert('keys_too_fast');
          return false;
        }
      }
    }

    const openTime = formOpenTimes.current[formId];
    if (!openTime || Date.now() - openTime < MIN_FORM_OPEN_MS) return false;

    return true;
  }, []);

  return { markFormOpen, trackKey, triggerHoneypot, validateSubmit };
}
