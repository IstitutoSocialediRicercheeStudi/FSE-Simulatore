# PR FSE+ Sicilia 2021-2027 - Demo Portale

Applicazione React/Vite che simula il flusso operativo del portale PR FSE+:

- landing pubblica con avvisi;
- login (simulato) e dashboard;
- selezione ruolo;
- progettazione esecutiva (moduli, partecipanti, personale, stage);
- richiesta risorse e ricevuta.

## Requisiti

- Node.js 20+
- npm 10+

## Avvio locale

```bash
npm install
npm run dev
```

## Comandi utili

```bash
npm run lint
npm run build
npm run preview
```

## Struttura principale

- `src/context/AppDataContext.jsx`: stato applicativo e azioni principali (login/logout, navigazione, aggiornamenti stato corsi).
- `src/context/useAppData.js`: context React e hook `useAppData`.
- `src/pages/`: pagine funzionali del portale.
- `src/components/`: header e footer istituzionali.

## Deploy SPA

Sono già presenti i fallback router per deploy statico:

- `vercel.json`
- `netlify.toml`
