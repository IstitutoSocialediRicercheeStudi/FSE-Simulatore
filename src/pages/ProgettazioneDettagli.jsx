import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '../context/useAppData.js';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PROVINCES, PROVINCE_LABELS, COMUNI_BY_PROVINCE, COMUNI } from '../data/italyLocations.js';
import { useBotProtection } from '../hooks/useBotProtection.js';
import HoneypotField from '../components/HoneypotField.jsx';
import HintBadge from '../components/HintBadge.jsx';

const TABS = [
  { id: 'elenco', label: 'Elenco edizioni', bg: '#f8f9fa', text: '#6c757d' },
  { id: 'dettaglio', label: 'Dettaglio', bg: '#5890ff', text: 'white' },
  { id: 'partecipanti', label: 'Partecipanti', bg: '#5890ff', text: 'white' },
  { id: 'personale', label: 'Personale', bg: '#5890ff', text: 'white' },
  { id: 'stage', label: 'Stage', bg: '#5890ff', text: 'white' },
  { id: 'economici', label: 'Dati economici', bg: '#f0ad4e', text: 'white' },
  { id: 'verifica', label: 'Verifica e conferma P.E.', bg: '#d9534f', text: 'white' }
];

const STAFF_ROLES = ['REO', 'Direttore', 'Tutor', 'Personale Amministrativo', 'Orientatore'];
const PARTICIPANTS_MIN = 8;
const PARTICIPANTS_MAX = 15;
const STAFF_EXTERNAL_OPTIONS = [
  { value: 'No', label: 'No' },
  { value: 'Si', label: 'Si' }
];
const SEX_OPTIONS = [
  { value: 'M', label: 'Maschio' },
  { value: 'F', label: 'Femmina' }
];
const DISABILITY_OPTIONS = [
  { value: 'No', label: 'No' },
  { value: 'Si', label: 'Si' }
];
const CITIZENSHIP_OPTIONS = [
  { value: 'IT', label: 'ITALIA' },
  { value: 'UE', label: 'UNIONE EUROPEA' },
  { value: 'EXTRA_UE', label: 'PAESE EXTRA UE' }
];

const STUDY_TITLE_OPTIONS = [
  { value: '00', label: '00 - NESSUN TITOLO' },
  { value: '01', label: '01 - LICENZA ELEMENTARE/ATTESTATO DI VALUTAZIONE FINALE' },
  { value: '02', label: '02 - LICENZA MEDIA/AVVIAMENTO PROFESSIONALE' },
  { value: '03', label: "03 - TITOLO DI ISTRUZIONE SECONDARIA di II GRADO (SCOLASTICA o FORMAZIONE PROFESSIONALE) CHE NON PERMETTE L'ACCESSO ALL'UNIVERSITA'" },
  { value: '04', label: "04 - DIPLOMA DI ISTRUZIONE SECONDARIA di II GRADO CHE PERMETTE L'ACCESSO ALL'UNIVERSITA'" },
  { value: '05', label: '05 - QUALIFICA PROFESSIONALE REGIONALE POST-DIPLOMA, CERTIFICATO DI SPECIALIZZAZIONE TECNICA SUPERIORE IFTS' },
  { value: '06', label: '06 - DIPLOMA DI TECNICO SUPERIORE (ITS)' },
  { value: '07', label: '07 - LAUREA DI I LIVELLO (triennale), DIPLOMA UNIVERSITARIO, DIPLOMA ACCADEMICO di I LIVELLO (AFAM)' },
  { value: '08', label: '08 - LAUREA MAGISTRALE/SPECIALISTICA di II LIVELLO, DIPLOMA DI LAUREA DEL VECCHIO ORDINAMENTO (4-6 anni)' },
  { value: '09', label: '09 - TITOLO DI DOTTORE DI RICERCA' }
];

const OCCUPATION_OPTIONS = [
  { value: '01', label: '01 Inoccupato' },
  { value: '02', label: '02 Inattivo' },
  { value: '03', label: '03 Disoccupato' }
];

const EMPTY_PARTICIPANT = {
  dataSelezione: '',
  nome: '',
  cognome: '',
  sesso: '',
  disabile: 'No',
  dataNascita: '',
  provinciaNascita: '',
  comuneNascita: '',
  altroComuneNascita: '',
  codiceFiscale: '',
  cittadinanza: '',
  residenzaProvincia: '',
  residenzaComune: '',
  domicilioProvincia: '',
  domicilioComune: '',
  titoloStudio: '00',
  condizioneOccupazionale: '01'
};

const EMPTY_STAFF = {
  nome: '',
  cognome: '',
  codiceFiscale: '',
  telefono: '',
  email: '',
  dataNascita: '',
  ruolo: '',
  personaleEsterno: ''
};
const EMPTY_HOST = {
  denominazione: '',
  partitaIva: '',
  allievi: '',
  legaleProvincia: '',
  legaleComune: '',
  legaleIndirizzo: '',
  legaleCivico: '',
  operativaProvincia: '',
  operativaComune: '',
  operativaIndirizzo: '',
  operativaCivico: ''
};

const DATE_INPUT_HINT = 'Usa ggmmaaaa, gg/mm/aaaa o yyyy-mm-dd';
const PROGRAM_END_LIMIT_DATE = new Date(2027, 11, 31);
const POC_AVVIO_LIMIT_DATE = new Date(2026, 5, 3);   // 03/06/2026
const POC_FINE_LIMIT_DATE = new Date(2026, 10, 20);  // 20/11/2026
const PARTICIPANT_FIELD_BORDER_COLOR = '#d7a3a3';
const PARTICIPANT_FIELD_ERROR_BORDER_COLOR = '#d9534f';

const CF_ODD_VALUES = {
  0:1, 1:0, 2:5, 3:7, 4:9, 5:13, 6:15, 7:17, 8:19, 9:21,
  A:1, B:0, C:5, D:7, E:9, F:13, G:15, H:17, I:19, J:21,
  K:2, L:4, M:18, N:20, O:11, P:3, Q:6, R:8, S:12, T:14,
  U:16, V:10, W:22, X:25, Y:24, Z:23
};
const CF_EVEN_VALUES = {
  0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9,
  A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, I:8, J:9,
  K:10, L:11, M:12, N:13, O:14, P:15, Q:16, R:17, S:18, T:19,
  U:20, V:21, W:22, X:23, Y:24, Z:25
};

function isValidCodiceFiscale(cf) {
  const value = String(cf || '').trim().toUpperCase();
  if (!/^[A-Z]{6}[0-9]{2}[ABCDEHLMPRST][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(value)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const ch = value[i];
    sum += (i % 2 === 0) ? CF_ODD_VALUES[ch] : CF_EVEN_VALUES[ch];
  }
  return String.fromCharCode(65 + (sum % 26)) === value[15];
}

function parseFlexibleDate(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value) return null;

  const compactValue = value.replace(/\s+/g, '');
  let day;
  let month;
  let year;
  let match;

  match = compactValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  } else {
    match = compactValue.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if (match) {
      day = Number(match[1]);
      month = Number(match[2]);
      year = Number(match[3]);
    } else {
      match = compactValue.match(/^((?:19|20)\d{2})(\d{2})(\d{2})$/);
      if (match) {
        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);
      } else {
        match = compactValue.match(/^(\d{2})(\d{2})(\d{4})$/);
        if (!match) return null;
        day = Number(match[1]);
        month = Number(match[2]);
        year = Number(match[3]);
      }
    }
  }

  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== (month - 1) ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function toIsoDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateInput(rawValue) {
  const parsed = parseFlexibleDate(rawValue);
  if (!parsed) return String(rawValue || '').trim();
  return toIsoDateString(parsed);
}

function validateDetail(detail) {
  const errors = [];
  const dataAvvioRaw = String(detail.dataAvvio || '').trim();
  const dataFineRaw = String(detail.dataFine || '').trim();
  const dataAvvioDate = parseFlexibleDate(dataAvvioRaw);
  const dataFineDate = parseFlexibleDate(dataFineRaw);

  if (!dataAvvioRaw) errors.push("Il campo data avvio prevista e' obbligatorio.");
  if (!dataFineRaw) errors.push("Il campo data fine prevista e' obbligatorio.");
  if (dataAvvioRaw && !dataAvvioDate) errors.push("Formato data avvio non valido. Usa ggmmaaaa, gg/mm/aaaa o yyyy-mm-dd.");
  if (dataFineRaw && !dataFineDate) errors.push("Formato data fine non valido. Usa ggmmaaaa, gg/mm/aaaa o yyyy-mm-dd.");
  if (detail.importo === '') errors.push("Il campo importo finanziamenti e' obbligatorio.");
  if (detail.importo !== '' && Number(detail.importo) < 0) errors.push("L'importo finanziamenti non puo' essere negativo.");
  if (dataAvvioDate && dataAvvioDate > PROGRAM_END_LIMIT_DATE) errors.push("La data di avvio non puo' superare il 31/12/2027.");
  if (dataAvvioDate && dataAvvioDate > POC_AVVIO_LIMIT_DATE) errors.push("La data di avvio non puo' essere successiva al 03/06/2026 (limite Avviso POC n. 1/2026).");
  if (dataFineDate && dataFineDate > POC_FINE_LIMIT_DATE) errors.push("La data di fine non puo' essere successiva al 20/11/2026 (limite Avviso POC n. 1/2026).");
  if (dataAvvioDate && dataFineDate && dataFineDate < dataAvvioDate) {
    errors.push("La data di fine non puo' essere precedente alla data di avvio.");
  }
  const fasciaARaw = String(detail.oreFasciaA ?? '').trim();
  const fasciaBRaw = String(detail.oreFasciaB ?? '').trim();
  const fasciaCRaw = String(detail.oreFasciaC ?? '').trim();
  if (!fasciaARaw && !fasciaBRaw && !fasciaCRaw) errors.push("Compilare almeno una fascia oraria docenti (punto 2.18.5).");
  if (fasciaARaw && (Number(fasciaARaw) < 0 || !Number.isFinite(Number(fasciaARaw)))) errors.push("Ore Fascia A non valide.");
  if (fasciaBRaw && (Number(fasciaBRaw) < 0 || !Number.isFinite(Number(fasciaBRaw)))) errors.push("Ore Fascia B non valide.");
  if (fasciaCRaw && (Number(fasciaCRaw) < 0 || !Number.isFinite(Number(fasciaCRaw)))) errors.push("Ore Fascia C non valide.");
  return errors;
}

function validateParticipant(form) {
  const errors = {};
  const required = [
    'dataSelezione',
    'nome',
    'cognome',
    'sesso',
    'dataNascita',
    'provinciaNascita',
    'comuneNascita',
    'codiceFiscale',
    'cittadinanza',
    'residenzaProvincia',
    'residenzaComune',
    'titoloStudio',
    'condizioneOccupazionale'
  ];
  required.forEach((field) => {
    if (!String(form[field] || '').trim()) errors[field] = 'Campo obbligatorio';
  });
  if (form.codiceFiscale && !isValidCodiceFiscale(form.codiceFiscale)) {
    errors.codiceFiscale = 'Codice fiscale non valido.';
  }

  const dataSelezioneRaw = String(form.dataSelezione || '').trim();
  const dataNascitaRaw = String(form.dataNascita || '').trim();
  const dataSelezioneDate = parseFlexibleDate(dataSelezioneRaw);
  const dataNascitaDate = parseFlexibleDate(dataNascitaRaw);

  if (dataSelezioneRaw && !dataSelezioneDate) {
    errors.dataSelezione = 'Formato data non valido (usa ggmmaaaa, gg/mm/aaaa o yyyy-mm-dd).';
  }
  if (dataNascitaRaw && !dataNascitaDate) {
    errors.dataNascita = 'Formato data non valido (usa ggmmaaaa, gg/mm/aaaa o yyyy-mm-dd).';
  }
  if (dataNascitaDate && dataNascitaDate > new Date()) {
    errors.dataNascita = 'Data di nascita non valida';
  }
  if (dataSelezioneDate && dataNascitaDate && dataNascitaDate > dataSelezioneDate) {
    errors.dataNascita = 'La data di nascita non puo\' essere successiva alla data selezione.';
  }

  const domicilioCompilato = Boolean(form.domicilioProvincia || form.domicilioComune);
  if (domicilioCompilato && (!form.domicilioProvincia || !form.domicilioComune)) {
    if (!form.domicilioProvincia) errors.domicilioProvincia = 'Compilare provincia domicilio';
    if (!form.domicilioComune) errors.domicilioComune = 'Compilare comune domicilio';
  }
  return errors;
}

function getStageDayBounds(hoursValue) {
  const hours = Number(hoursValue);
  if (!Number.isFinite(hours) || hours <= 0) {
    return { min: 0, max: 0 };
  }
  return {
    min: Math.ceil(hours / 8),
    max: Math.ceil(hours / 4)
  };
}

function createStageForm(detail) {
  return {
    oreStage: String(detail?.stageHours || '400'),
    dataAvvio: detail?.stageDataAvvio || '',
    dataFine: detail?.stageDataFine || '',
    giornateStage: String(detail?.stageDays || '0')
  };
}

function validateStage(form) {
  const errors = {};
  const oreValue = Number(form.oreStage);
  const giornateValue = Number(form.giornateStage);
  const { min, max } = getStageDayBounds(form.oreStage);

  if (!String(form.oreStage || '').trim() || !Number.isFinite(oreValue) || oreValue <= 0) {
    errors.oreStage = 'Inserire un numero ore stage valido.';
  }
  const dataAvvioRaw = String(form.dataAvvio || '').trim();
  const dataFineRaw = String(form.dataFine || '').trim();
  const dataAvvioDate = parseFlexibleDate(dataAvvioRaw);
  const dataFineDate = parseFlexibleDate(dataFineRaw);

  if (!dataAvvioRaw) errors.dataAvvio = 'Campo obbligatorio';
  if (!dataFineRaw) errors.dataFine = 'Campo obbligatorio';
  if (dataAvvioRaw && !dataAvvioDate) errors.dataAvvio = 'Formato data non valido';
  if (dataFineRaw && !dataFineDate) errors.dataFine = 'Formato data non valido';
  if (dataAvvioDate && dataFineDate && dataFineDate < dataAvvioDate) {
    errors.dataFine = 'La data fine prevista non puo\' essere precedente alla data avvio prevista.';
  }
  if (!String(form.giornateStage || '').trim() || !Number.isFinite(giornateValue) || giornateValue < 0) {
    errors.giornateStage = 'Inserire un numero giornate valido.';
  } else if (!errors.oreStage && giornateValue < min) {
    errors.giornateStage = `Le giornate stage non possono essere inferiori a ${min}.`;
  } else if (!errors.oreStage && giornateValue > max) {
    errors.giornateStage = `Le giornate stage non possono superare ${max}.`;
  }

  return errors;
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('it-IT');
}

function formatDate(value) {
  if (!value) return '-';
  const date = parseFlexibleDate(value);
  if (!date) return '-';
  return date.toLocaleDateString('it-IT');
}

function getAgeAtDate(birthDateValue, referenceDateValue) {
  const birthDate = parseFlexibleDate(birthDateValue);
  const referenceDate = parseFlexibleDate(referenceDateValue);
  if (!birthDate || !referenceDate) return '-';
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age >= 0 ? String(age) : '-';
}

function getOccupationText(value) {
  const label = OCCUPATION_OPTIONS.find((option) => option.value === value)?.label || value || '-';
  return label.replace(/^\d+\s*/, '');
}

function getProvinceOptionLabel(provinceCode) {
  const provinceName = PROVINCE_LABELS[provinceCode];
  return provinceName ? `${provinceCode} - ${provinceName}` : provinceCode;
}

function getParticipantFieldStyle(hasError = false) {
  return {
    borderColor: hasError ? PARTICIPANT_FIELD_ERROR_BORDER_COLOR : PARTICIPANT_FIELD_BORDER_COLOR,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '4px',
    boxShadow: 'none'
  };
}

function ProgettazioneDettagli() {
  const {
    activeEditionId,
    getActiveCourse,
    getActiveEdition,
    getActiveEditionData,
    navigateTo,
    saveEditionDetail,
    addParticipant,
    updateParticipant,
    removeParticipant,
    addStaffMember,
    addHostEntity,
    setEditionVerification,
    resetEditionData,
    requiredRoles
  } = useAppData();

  const [activeTab, setActiveTab] = useLocalStorage('fse_pe_activeTab', 'dettaglio');
  const course = getActiveCourse();
  const edition = getActiveEdition();
  const editionData = getActiveEditionData();

  const [detailErrors, setDetailErrors] = useState([]);
  const [feedback, setFeedback] = useState('');

  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [participantForm, setParticipantForm] = useState(EMPTY_PARTICIPANT);
  const [participantErrors, setParticipantErrors] = useState({});
  const [editingParticipantId, setEditingParticipantId] = useState(null);
  const participantNameRef = useRef(null);

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [staffErrors, setStaffErrors] = useState({});

  const [showHostForm, setShowHostForm] = useState(false);
  const [hostForm, setHostForm] = useState(EMPTY_HOST);
  const [hostErrors, setHostErrors] = useState({});
  const [stageForm, setStageForm] = useState(() => createStageForm(editionData.detail || {}));
  const [stageErrors, setStageErrors] = useState({});
  const [stageFeedback, setStageFeedback] = useState('');
  const [botError, setBotError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { markFormOpen, trackKey, triggerHoneypot, validateSubmit } = useBotProtection();

  const participants = editionData.participants || [];
  const staff = editionData.staff || [];
  const hosts = editionData.hosts || [];

  useEffect(() => {
    if (showParticipantForm) {
      participantNameRef.current?.focus();
      markFormOpen('participant');
      setBotError('');
    }
  }, [showParticipantForm, markFormOpen]);

  useEffect(() => {
    if (showStaffForm) markFormOpen('staff');
  }, [showStaffForm, markFormOpen]);

  useEffect(() => {
    if (showHostForm) markFormOpen('host');
  }, [showHostForm, markFormOpen]);

  const detailForm = editionData.detail || {};
  const missingRoles = requiredRoles.filter((role) => !staff.some((item) => item.ruolo === role));
  const minAllievi = PARTICIPANTS_MIN;
  const maxAllievi = PARTICIPANTS_MAX;
  const hasParticipantBelowMin = participants.length < minAllievi;
  const hasParticipantAboveMax = participants.length > maxAllievi;

  const hasDettaglioErrors = validateDetail(editionData.detail).length > 0;
  const hasPartecipantiErrors = hasParticipantBelowMin || hasParticipantAboveMax;
  const hasPersonaleErrors = missingRoles.length > 0;
  const hasStageErrors = hosts.length === 0;
  const disabiliInseriti = participants.filter((participant) => String(participant.disabile || '').toLowerCase() === 'si').length;
  const maxAllieviDisabili = Math.max(1, Math.floor((participants.length || maxAllievi) * 0.2));
  const hasDisabiliExceeded = disabiliInseriti > maxAllieviDisabili;
  const allValid = !hasDettaglioErrors && !hasPartecipantiErrors && !hasPersonaleErrors && !hasStageErrors && !hasDisabiliExceeded;
  const detailHasError = (needle) => detailErrors.some((error) => error.toLowerCase().includes(needle));
  const stageBounds = getStageDayBounds(stageForm.oreStage);
  const comuniNascitaOptions = COMUNI_BY_PROVINCE[participantForm.provinciaNascita] || [];
  const comuniResidenzaOptions = COMUNI_BY_PROVINCE[participantForm.residenzaProvincia] || [];
  const comuniDomicilioOptions = COMUNI_BY_PROVINCE[participantForm.domicilioProvincia] || [];

  if (!course || !edition) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4">
          <h2 className="h4 text-primary mb-3">Dettaglio progettazione esecutiva</h2>
          <p className="text-muted mb-4">Nessuna edizione selezionata. Torna alla lista percorsi e apri una riga.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigateTo('sedi')}>
            Vai a Percorsi e sedi
          </button>
        </div>
      </div>
    );
  }

  const handleSaveDetail = () => {
    const errors = validateDetail(detailForm);
    setDetailErrors(errors);
    if (errors.length > 0) {
      setFeedback('');
      return;
    }
    saveEditionDetail(activeEditionId, {
      dataAvvio: normalizeDateInput(detailForm.dataAvvio),
      dataFine: normalizeDateInput(detailForm.dataFine),
      giornateAulaPreviste: String(detailForm.giornateAulaPreviste ?? '').trim(),
      oreFasciaA: String(detailForm.oreFasciaA ?? '').trim(),
      oreFasciaB: String(detailForm.oreFasciaB ?? '').trim(),
      oreFasciaC: String(detailForm.oreFasciaC ?? '').trim()
    });
    setFeedback('Dati del dettaglio percorso salvati con successo.');
  };

  const savingParticipantRef = useRef(false);

  const handleSaveParticipant = () => {
    if (savingParticipantRef.current) return;
    savingParticipantRef.current = true;

    try {
      if (!validateSubmit('participant')) {
        setBotError('Compilazione automatica rilevata. Inserire i dati manualmente dal browser.');
        return;
      }
      setBotError('');
      const errors = validateParticipant(participantForm);
      if (!editingParticipantId && participants.length >= maxAllievi) {
        errors.limite = `Numero massimo destinatari raggiunto (${maxAllievi}).`;
      }
      setParticipantErrors(errors);
      if (Object.keys(errors).length > 0) return;

      const normalizedPayload = {
        ...participantForm,
        codiceFiscale: participantForm.codiceFiscale.toUpperCase(),
        dataSelezione: normalizeDateInput(participantForm.dataSelezione),
        dataNascita: normalizeDateInput(participantForm.dataNascita)
      };

      if (editingParticipantId) {
        updateParticipant(activeEditionId, editingParticipantId, normalizedPayload);
      } else {
        addParticipant(activeEditionId, normalizedPayload);
      }

      setParticipantForm(EMPTY_PARTICIPANT);
      setParticipantErrors({});
      setEditingParticipantId(null);
      setShowParticipantForm(false);
    } finally {
      setTimeout(() => { savingParticipantRef.current = false; }, 300);
    }
  };

  const handleEditParticipant = (participant) => {
    if (!participant) return;
    setParticipantForm({ ...EMPTY_PARTICIPANT, ...participant });
    setParticipantErrors({});
    setEditingParticipantId(participant.id);
    setShowParticipantForm(true);
  };

  const handleDeleteParticipant = (participantId) => {
    if (!participantId) return;
    if (!window.confirm('Confermi l\'eliminazione del partecipante?')) return;
    removeParticipant(activeEditionId, participantId);
    if (editingParticipantId === participantId) {
      setParticipantForm(EMPTY_PARTICIPANT);
      setParticipantErrors({});
      setEditingParticipantId(null);
      setShowParticipantForm(false);
    }
  };

  const handleCancelParticipantForm = () => {
    setParticipantForm(EMPTY_PARTICIPANT);
    setParticipantErrors({});
    setEditingParticipantId(null);
    setShowParticipantForm(false);
  };

  const handleSaveStaff = () => {
    if (!validateSubmit('staff')) {
      setBotError('Compilazione automatica rilevata. Inserire i dati manualmente dal browser.');
      return;
    }
    setBotError('');
    const errors = {};
    const normalizedTaxCode = staffForm.codiceFiscale.trim().toUpperCase();
    const normalizedPhone = staffForm.telefono.trim();
    const normalizedEmail = staffForm.email.trim();
    const normalizedBirthDate = normalizeDateInput(staffForm.dataNascita);
    const birthDate = parseFlexibleDate(staffForm.dataNascita);

    if (!staffForm.nome.trim()) errors.nome = 'Campo obbligatorio';
    if (!staffForm.cognome.trim()) errors.cognome = 'Campo obbligatorio';
    if (!normalizedTaxCode) {
      errors.codiceFiscale = 'Campo obbligatorio';
    } else if (!isValidCodiceFiscale(normalizedTaxCode)) {
      errors.codiceFiscale = 'Codice fiscale non valido.';
    }
    if (!normalizedPhone) {
      errors.telefono = 'Campo obbligatorio';
    } else if (!/^[0-9+\s]{6,20}$/.test(normalizedPhone)) {
      errors.telefono = 'Telefono non valido';
    }
    if (!staffForm.ruolo) errors.ruolo = 'Campo obbligatorio';
    if (!normalizedEmail) {
      errors.email = 'Campo obbligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = 'Email non valida';
    }
    if (!String(staffForm.dataNascita || '').trim()) {
      errors.dataNascita = 'Campo obbligatorio';
    } else if (!birthDate) {
      errors.dataNascita = 'Formato data non valido (usa ggmmaaaa, gg/mm/aaaa o yyyy-mm-dd).';
    } else if (birthDate > new Date()) {
      errors.dataNascita = 'Data di nascita non valida';
    }
    if (!staffForm.personaleEsterno) errors.personaleEsterno = 'Campo obbligatorio';
    if (staffForm.ruolo && staff.some((item) => item.ruolo === staffForm.ruolo)) errors.ruolo = 'Ruolo gia presente';
    setStaffErrors(errors);
    if (Object.keys(errors).length > 0) return;
    addStaffMember(activeEditionId, {
      ...staffForm,
      nome: staffForm.nome.trim(),
      cognome: staffForm.cognome.trim(),
      codiceFiscale: normalizedTaxCode,
      telefono: normalizedPhone,
      email: normalizedEmail,
      dataNascita: normalizedBirthDate
    });
    setStaffForm(EMPTY_STAFF);
    setStaffErrors({});
    setShowStaffForm(false);
  };

  const handleSaveHost = () => {
    if (!validateSubmit('host')) {
      setBotError('Compilazione automatica rilevata. Inserire i dati manualmente dal browser.');
      return;
    }
    setBotError('');
    const errors = {};
    if (!hostForm.denominazione.trim()) errors.denominazione = 'Campo obbligatorio';
    if (!/^\d{11}$/.test(hostForm.partitaIva || '')) errors.partitaIva = 'P.IVA non valida (11 cifre)';
    if (!hostForm.allievi || Number(hostForm.allievi) <= 0) errors.allievi = 'Numero allievi non valido';
    if (!hostForm.legaleProvincia) errors.legaleProvincia = 'Campo obbligatorio';
    if (!hostForm.legaleComune.trim()) errors.legaleComune = 'Campo obbligatorio';
    if (!hostForm.legaleIndirizzo.trim()) errors.legaleIndirizzo = 'Campo obbligatorio';
    if (!hostForm.legaleCivico.trim()) errors.legaleCivico = 'Campo obbligatorio';
    setHostErrors(errors);
    if (Object.keys(errors).length > 0) return;

    addHostEntity(activeEditionId, {
      denominazione: hostForm.denominazione.trim(),
      partitaIva: hostForm.partitaIva.trim(),
      allievi: Number(hostForm.allievi),
      sedeLegale: `${hostForm.legaleIndirizzo.trim()} ${hostForm.legaleCivico.trim()} - ${hostForm.legaleComune.trim()} (${hostForm.legaleProvincia})`,
      sedeOperativa: hostForm.operativaIndirizzo
        ? `${hostForm.operativaIndirizzo.trim()} ${hostForm.operativaCivico.trim()} - ${hostForm.operativaComune.trim()} (${hostForm.operativaProvincia})`
        : 'Coincidente con sede legale'
    });

    setHostForm(EMPTY_HOST);
    setHostErrors({});
    setShowHostForm(false);
  };

  const handleSaveStage = () => {
    const errors = validateStage(stageForm);
    setStageErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStageFeedback('');
      return;
    }

    const bounds = getStageDayBounds(stageForm.oreStage);
    saveEditionDetail(activeEditionId, {
      stageHours: String(stageForm.oreStage).trim(),
      stageDataAvvio: normalizeDateInput(stageForm.dataAvvio),
      stageDataFine: normalizeDateInput(stageForm.dataFine),
      stageMinDays: String(bounds.min),
      stageMaxDays: String(bounds.max),
      stageDays: String(stageForm.giornateStage).trim()
    });

    setStageFeedback('Dati stage salvati con successo.');
  };

  const handleCancelStage = () => {
    setStageForm(createStageForm(detailForm));
    setStageErrors({});
    setStageFeedback('');
  };

  return (
    <div className="container-fluid px-0" style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {detailErrors.length > 0 && (
        <div style={{ backgroundColor: '#f9eaea', color: '#a94442', padding: '1rem 4rem', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #ebccd1' }}>
          {detailErrors.map((error) => <div key={error}>{error}</div>)}
        </div>
      )}
      {feedback && (
        <div style={{ backgroundColor: '#e8f7ee', color: '#276738', padding: '0.9rem 4rem', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #c7e7d0' }}>
          {feedback}
        </div>
      )}

      <div className="bg-white px-4 border-bottom pb-3 mb-4 d-flex justify-content-between align-items-end">
        <div className="pt-4 mb-2 d-flex align-items-center" style={{ gap: '8px' }}>
          <button type="button" className="btn border-0 text-white px-3" style={{ backgroundColor: '#4caf50', fontSize: '0.8rem' }} onClick={() => navigateTo('sedi', { courseId: course.id, editionId: edition.id })}>
            Torna ai Percorsi
          </button>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Azzera dati
          </button>
        </div>
        <div className="d-flex" style={{ gap: '1px' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="btn border-0 rounded-0 px-3 py-2"
              style={{ backgroundColor: tab.bg, color: tab.text, fontSize: '0.75rem', opacity: activeTab === tab.id ? 1 : 0.85, borderBottom: activeTab === tab.id ? '2px solid #333' : 'none' }}
              onClick={() => {
                if (tab.id === 'elenco') {
                  navigateTo('sedi', { courseId: course.id, editionId: edition.id });
                  return;
                }
                if (tab.id === 'stage') {
                  setStageForm(createStageForm(detailForm));
                  setStageErrors({});
                  setStageFeedback('');
                }
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        <h3 style={{ fontSize: '1.4rem', color: '#666', fontWeight: 300 }} className="mb-4">
          Progettazione esecutiva - Riferimento edizione {edition.id}
        </h3>

        {activeTab === 'dettaglio' && (
          <>
            <div className="card border rounded-0 shadow-sm mb-3">
              <table className="table table-sm mb-0" style={{ fontSize: '0.8rem' }}>
                <tbody>
                  <tr>
                    <th className="w-25" style={{ backgroundColor: '#f7f7f7' }}>Titolo / Denominazione del percorso</th>
                    <td><strong>{course.title}</strong></td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: '#f7f7f7' }}>Allievi minimi / Allievi massimi:</th>
                    <td><strong>{minAllievi} / {maxAllievi}</strong></td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: '#f7f7f7' }}>Allievi disabili inseriti</th>
                    <td><strong>{disabiliInseriti}</strong></td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: '#f7f7f7' }}>Numero massimo allievi disabili</th>
                    <td><strong>{maxAllieviDisabili}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card border-0 rounded-0 shadow-sm mb-4">
              <div className="card-header border-0 rounded-0 p-2 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#4f8fe8', fontWeight: 600 }}>
                <span>Dettaglio Percorso</span>
                <HintBadge text="Compila tutti i campi obbligatori: date di avvio e fine, importo, e almeno una fascia oraria docenti. Le date devono rispettare i limiti del programma (fino al 31/12/2027)." position="left" />
              </div>
              <div className="card-body p-3">
                <div className="mb-2" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sede di erogazione del percorso</div>
                <div className="row g-3 mb-3">
                  <div className="col-md-4"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Indirizzo</label><input type="text" className="form-control form-control-sm" value={detailForm.address || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-1"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>N. civico</label><input type="text" className="form-control form-control-sm" value={detailForm.civic || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-2"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>CAP</label><input type="text" className="form-control form-control-sm" value={detailForm.cap || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-3"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Citta'</label><input type="text" className="form-control form-control-sm" value={detailForm.city || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-2"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Provincia</label><select className="form-select form-select-sm" value={detailForm.province || ''} disabled style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }}><option value="">Seleziona</option>{PROVINCES.map((province) => <option key={province} value={province}>{getProvinceOptionLabel(province)}</option>)}</select></div>
                </div>

                <div className="mb-2" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Caratteristiche del percorso</div>
                <div className="row g-3">
                  <div className="col-md-2"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Totale Massimo Mesi Percorso</label><input type="number" className="form-control form-control-sm" value={detailForm.maxMonths || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-2"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Data avvio prevista</label><input name="data_avvio" data-field="data_avvio" type="text" inputMode="numeric" autoComplete="off" placeholder="ggmmaaaa" title={DATE_INPUT_HINT} className="form-control form-control-sm" value={detailForm.dataAvvio || ''} onChange={(event) => saveEditionDetail(activeEditionId, { dataAvvio: event.target.value })} style={{ borderColor: detailHasError('avvio') ? '#d9534f' : '#ccc' }} /></div>
                  <div className="col-md-2"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Data fine prevista</label><input name="data_fine" data-field="data_fine" type="text" inputMode="numeric" autoComplete="off" placeholder="ggmmaaaa" title={DATE_INPUT_HINT} className="form-control form-control-sm" value={detailForm.dataFine || ''} onChange={(event) => saveEditionDetail(activeEditionId, { dataFine: event.target.value })} style={{ borderColor: detailHasError('fine') ? '#d9534f' : '#ccc' }} /></div>
                  <div className="col-md-2"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Capienza aula effettiva</label><input type="number" className="form-control form-control-sm" value={detailForm.classroomCapacity || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-4"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Numero di giornate minime (Giornata formativa di 8 ore)</label><input type="number" className="form-control form-control-sm" value={detailForm.minDays8h || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-4"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Numero di giornate massime (Giornata formativa di 4 ore)</label><input type="number" className="form-control form-control-sm" value={detailForm.maxDays4h || ''} readOnly style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }} /></div>
                  <div className="col-md-4">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Giornate di aula previste + stage</label>
                    <input
                      name="giornate_aula_previste"
                      data-field="giornate_aula_previste"
                      type="number"
                      min="0"
                      className="form-control form-control-sm"
                      value={detailForm.giornateAulaPreviste || ''}
                      onChange={(event) => saveEditionDetail(activeEditionId, { giornateAulaPreviste: event.target.value })}
                      style={{ borderColor: '#ccc' }}
                    />
                  </div>
                  <div className="col-md-4"><label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Importo totale finanziamenti PO FSE 2014-2020 e PR FSE+ Sicilia 2021-2027 ricevuti</label><input name="importo_totale_finanziamenti" data-field="importo_totale_finanziamenti" type="number" className="form-control form-control-sm" value={detailForm.importo || ''} onChange={(event) => saveEditionDetail(activeEditionId, { importo: event.target.value })} style={{ borderColor: detailHasError('importo finanziamenti') ? '#d9534f' : '#ccc' }} /></div>
                </div>

                <div className="mb-2 mt-3" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ore docenti per fascia professionale (punto 2.18.5)</div>
                <div className="p-2 mb-2" style={{ backgroundColor: '#e9f2ff', border: '1px solid #d2e3ff', fontSize: '0.72rem' }}>
                  Le ore delle tre fasce devono coprire il totale delle ore d&apos;aula/FAD del percorso. Fascia A = profilo alto, Fascia B = medio, Fascia C = base.
                </div>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>N. ore Fascia A <span style={{ color: '#d9534f' }}>*</span></label>
                    <input
                      name="ore_fascia_a"
                      data-field="ore_fascia_a"
                      type="number"
                      min="0"
                      className="form-control form-control-sm"
                      value={detailForm.oreFasciaA || ''}
                      onChange={(event) => saveEditionDetail(activeEditionId, { oreFasciaA: event.target.value })}
                      style={{ borderColor: detailHasError('fascia a') ? '#d9534f' : '#ccc' }}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>N. ore Fascia B <span style={{ color: '#d9534f' }}>*</span></label>
                    <input
                      name="ore_fascia_b"
                      data-field="ore_fascia_b"
                      type="number"
                      min="0"
                      className="form-control form-control-sm"
                      value={detailForm.oreFasciaB || ''}
                      onChange={(event) => saveEditionDetail(activeEditionId, { oreFasciaB: event.target.value })}
                      style={{ borderColor: detailHasError('fascia b') ? '#d9534f' : '#ccc' }}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>N. ore Fascia C <span style={{ color: '#d9534f' }}>*</span></label>
                    <input
                      name="ore_fascia_c"
                      data-field="ore_fascia_c"
                      type="number"
                      min="0"
                      className="form-control form-control-sm"
                      value={detailForm.oreFasciaC || ''}
                      onChange={(event) => saveEditionDetail(activeEditionId, { oreFasciaC: event.target.value })}
                      style={{ borderColor: detailHasError('fascia c') ? '#d9534f' : '#ccc' }}
                    />
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>
                      Totale ore fascia: <strong>{(Number(detailForm.oreFasciaA) || 0) + (Number(detailForm.oreFasciaB) || 0) + (Number(detailForm.oreFasciaC) || 0)}</strong>
                    </div>
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-sm text-white px-3" style={{ backgroundColor: '#5890ff' }} onClick={handleSaveDetail}>SALVA</button>
                    <button type="button" className="btn btn-sm text-white px-3" style={{ backgroundColor: '#f0ad4e' }} onClick={() => { setDetailErrors([]); setFeedback(''); }}>Annulla</button>
                  </div>
                </div>
              </div>
            </div>


            <div className="card border-0 rounded-0 shadow-sm mb-5">
              <div className="card-header border-0 rounded-0 p-2 text-white" style={{ backgroundColor: '#4f8fe8', fontWeight: 600 }}>Sedi Operative Occasionali</div>
              <div className="card-body p-0">
                <div className="p-3" style={{ backgroundColor: '#f2af79', fontSize: '0.78rem', lineHeight: 1.5, borderBottom: '1px solid #ef9f60' }}>
                  <strong>Nel solo caso di percorsi che prevedono ore d'aula presso ulteriori sedi di erogazione occasionali - ad es. per attivita' di natura laboratoriale - indicare di seguito le informazioni richieste.</strong>
                  <div className="mt-2">N.B. Anche per queste sedi valgono tutte le disposizioni previste dal D.P. Reg. n.25/2015 e dall'Avviso 7/23 in ordine all'accreditamento entro la data di sottoscrizione dell'Atto di adesione.</div>
                </div>
                <div className="d-flex justify-content-end p-2">
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{ backgroundColor: '#5890ff' }}
                    onClick={() => {
                      setStageForm(createStageForm(detailForm));
                      setStageErrors({});
                      setStageFeedback('');
                      setActiveTab('stage');
                    }}
                  >
                    + Aggiungi Sede
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'economici' && (
          <div className="card border-0 rounded-0 shadow-sm mb-5">
            <div className="card-header border-0 rounded-0 p-2 text-white" style={{ backgroundColor: '#f0ad4e', fontWeight: 600 }}>Dati economici</div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label mb-1" style={{ fontSize: '0.8rem' }}>Importo totale finanziamenti PO FSE 2014-2020 e PR FSE+ Sicilia 2021-2027 ricevuti</label>
                  <input name="importo_totale_finanziamenti" data-field="importo_totale_finanziamenti" type="number" className="form-control" value={detailForm.importo || ''} onChange={(event) => saveEditionDetail(activeEditionId, { importo: event.target.value })} style={{ borderColor: detailHasError('importo finanziamenti') ? '#d9534f' : '#ccc' }} />
                </div>
                <div className="col-md-4 d-flex align-items-end justify-content-end gap-2">
                  <button type="button" className="btn text-white" style={{ backgroundColor: '#5890ff' }} onClick={handleSaveDetail}>SALVA</button>
                  <button type="button" className="btn text-white" style={{ backgroundColor: '#f0ad4e' }} onClick={() => { setDetailErrors([]); setFeedback(''); }}>Annulla</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partecipanti' && (
          <div className="card border-0 rounded-0 shadow-sm mb-5">
            <div className="card-header border-0 rounded-0 p-2 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#5890ff' }}>
              <span>Elenco destinatari iscritti al percorso formativo</span>
              <HintBadge text="Inserisci tra 8 e 15 partecipanti. Massimo il 20% possono essere disabili. Il codice fiscale deve essere valido e univoco." position="left" />
            </div>
            <div className="card-body p-4">
              {hasParticipantBelowMin && <div className="alert mb-3" style={{ backgroundColor: '#fdbd83', border: '1px solid #f0ad4e', fontSize: '0.75rem' }}>Numero minimo destinatari non raggiunto: {minAllievi}</div>}
              {hasParticipantAboveMax && <div className="alert alert-danger mb-3" style={{ fontSize: '0.75rem' }}>Numero massimo destinatari superato: {maxAllievi}</div>}
              {hasDisabiliExceeded && <div className="alert alert-danger mb-3" style={{ fontSize: '0.75rem' }}>Superato il limite massimo del 20% di allievi disabili ({disabiliInseriti} inseriti, massimo consentito: {maxAllieviDisabili}).</div>}
              {!showParticipantForm && (
                <div className="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    className="btn text-white"
                    style={{ backgroundColor: '#5890ff', opacity: participants.length >= maxAllievi ? 0.75 : 1 }}
                    onClick={() => {
                      setParticipantForm(EMPTY_PARTICIPANT);
                      setParticipantErrors({});
                      setEditingParticipantId(null);
                      setShowParticipantForm(true);
                    }}
                    disabled={participants.length >= maxAllievi}
                  >
                    + Destinatario
                  </button>
                </div>
              )}

              {showParticipantForm && (
                <div className="border p-3 mb-4">
                  <HoneypotField onFill={triggerHoneypot} />
                  <div className="mb-3">
                    <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>
                      {editingParticipantId ? 'Modifica destinatario - Dati Anagrafici' : 'Dati Anagrafici'}
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">Data selezione</label>
                        <input
                          id="partecipante-data-selezione"
                          name="dataSelezione"
                          data-field="data_selezione"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="ggmmaaaa"
                          title={DATE_INPUT_HINT}
                          className="form-control"
                          value={participantForm.dataSelezione}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, dataSelezione: event.target.value }))}
                          onKeyDown={trackKey}
                          style={getParticipantFieldStyle(Boolean(participantErrors.dataSelezione))}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Nome</label>
                        <input
                          ref={participantNameRef}
                          id="partecipante-nome"
                          name="nome"
                          data-field="nome"
                          type="text"
                          className="form-control"
                          placeholder="Inserire nome del partecipante"
                          value={participantForm.nome}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, nome: event.target.value }))}
                          onKeyDown={trackKey}
                          style={getParticipantFieldStyle(Boolean(participantErrors.nome))}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Cognome</label>
                        <input
                          id="partecipante-cognome"
                          name="cognome"
                          data-field="cognome"
                          type="text"
                          className="form-control"
                          placeholder="Cognome"
                          value={participantForm.cognome}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, cognome: event.target.value }))}
                          onKeyDown={trackKey}
                          style={getParticipantFieldStyle(Boolean(participantErrors.cognome))}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Sesso</label>
                        <select
                          id="partecipante-sesso"
                          name="sesso"
                          data-field="sesso"
                          className="form-select"
                          value={participantForm.sesso}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, sesso: event.target.value }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.sesso))}
                        >
                          <option value="">Seleziona un valore</option>
                          {SEX_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Disabile</label>
                        <select
                          id="partecipante-disabile"
                          name="disabile"
                          data-field="disabile"
                          className="form-select"
                          value={participantForm.disabile}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, disabile: event.target.value }))}
                          style={getParticipantFieldStyle()}
                        >
                          {DISABILITY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Data di nascita</label>
                        <input
                          id="partecipante-data-nascita"
                          name="dataNascita"
                          data-field="data_nascita"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="ggmmaaaa"
                          title={DATE_INPUT_HINT}
                          className="form-control"
                          value={participantForm.dataNascita}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, dataNascita: event.target.value }))}
                          onKeyDown={trackKey}
                          style={getParticipantFieldStyle(Boolean(participantErrors.dataNascita))}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Provincia di nascita</label>
                        <select
                          id="partecipante-provincia-nascita"
                          name="provinciaNascita"
                          data-field="provincia_nascita"
                          className="form-select"
                          value={participantForm.provinciaNascita}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, provinciaNascita: event.target.value, comuneNascita: '' }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.provinciaNascita))}
                        >
                          <option value="">Seleziona un valore</option>
                          {PROVINCES.map((province) => <option key={province} value={province}>{getProvinceOptionLabel(province)}</option>)}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Comune di nascita</label>
                        <select
                          id="partecipante-comune-nascita"
                          name="comuneNascita"
                          data-field="comune_nascita"
                          className="form-select"
                          value={participantForm.comuneNascita}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, comuneNascita: event.target.value }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.comuneNascita))}
                        >
                          <option value="">Seleziona Provincia</option>
                          {comuniNascitaOptions.map((city) => <option key={`nascita-${city}`} value={city}>{city}</option>)}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Altro Comune di nascita (es. frazione)</label>
                        <input
                          id="partecipante-altro-comune-nascita"
                          name="altroComuneNascita"
                          data-field="altro_comune_nascita"
                          type="text"
                          className="form-control"
                          placeholder="Altro Comune di nascita (es. frazione)"
                          value={participantForm.altroComuneNascita}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, altroComuneNascita: event.target.value }))}
                          onKeyDown={trackKey}
                          style={getParticipantFieldStyle()}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Codice Fiscale</label>
                        <input
                          id="partecipante-codice-fiscale"
                          name="codiceFiscale"
                          data-field="codice_fiscale"
                          type="text"
                          className="form-control"
                          placeholder="Codice Fiscale"
                          value={participantForm.codiceFiscale}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, codiceFiscale: event.target.value }))}
                          onKeyDown={trackKey}
                          style={getParticipantFieldStyle(Boolean(participantErrors.codiceFiscale))}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Cittadinanza</label>
                        <select
                          id="partecipante-cittadinanza"
                          name="cittadinanza"
                          data-field="cittadinanza"
                          className="form-select"
                          value={participantForm.cittadinanza}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, cittadinanza: event.target.value }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.cittadinanza))}
                        >
                          <option value="">Seleziona un valore</option>
                          {CITIZENSHIP_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>Dati residenza</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Provincia</label>
                        <select
                          id="partecipante-residenza-provincia"
                          name="residenzaProvincia"
                          data-field="residenza_provincia"
                          className="form-select"
                          value={participantForm.residenzaProvincia}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, residenzaProvincia: event.target.value, residenzaComune: '' }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.residenzaProvincia))}
                        >
                          <option value="">Seleziona un valore</option>
                          {PROVINCES.map((province) => <option key={`res-${province}`} value={province}>{getProvinceOptionLabel(province)}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Comune</label>
                        <select
                          id="partecipante-residenza-comune"
                          name="residenzaComune"
                          data-field="residenza_comune"
                          className="form-select"
                          value={participantForm.residenzaComune}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, residenzaComune: event.target.value }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.residenzaComune))}
                        >
                          <option value="">Seleziona Provincia</option>
                          {comuniResidenzaOptions.map((city) => <option key={`res-comune-${city}`} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>Dati domicilio - <span style={{ color: '#a94442' }}>Compilare se il domicilio e' diverso dalla residenza</span></h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Provincia</label>
                        <select
                          id="partecipante-domicilio-provincia"
                          name="domicilioProvincia"
                          data-field="domicilio_provincia"
                          className="form-select"
                          value={participantForm.domicilioProvincia}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, domicilioProvincia: event.target.value, domicilioComune: '' }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.domicilioProvincia))}
                        >
                          <option value="">Seleziona un valore</option>
                          {PROVINCES.map((province) => <option key={`dom-${province}`} value={province}>{getProvinceOptionLabel(province)}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Comune</label>
                        <select
                          id="partecipante-domicilio-comune"
                          name="domicilioComune"
                          data-field="domicilio_comune"
                          className="form-select"
                          value={participantForm.domicilioComune}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, domicilioComune: event.target.value }))}
                          style={getParticipantFieldStyle(Boolean(participantErrors.domicilioComune))}
                        >
                          <option value="">Seleziona Provincia</option>
                          {comuniDomicilioOptions.map((city) => <option key={`dom-comune-${city}`} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="mb-2" style={{ fontSize: '1.1rem' }}>Dati personali</h5>
                    <div className="mb-2" style={{ fontSize: '0.95rem' }}>di essere in possesso del seguente titolo di studio</div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Specificare titolo di studio</label>
                        <select
                          id="partecipante-titolo-studio"
                          name="titoloStudio"
                          data-field="titolo_studio"
                          className="form-select"
                          value={participantForm.titoloStudio}
                          onChange={(event) => setParticipantForm((prev) => ({ ...prev, titoloStudio: event.target.value }))}
                          style={getParticipantFieldStyle()}
                        >
                          {STUDY_TITLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Condizione occupazionale</label>
                        <div className="d-flex gap-4">
                          {OCCUPATION_OPTIONS.map((opt) => (
                            <label key={opt.value}>
                              <input
                                className="form-check-input me-2"
                                type="radio"
                                id={`partecipante-condizione-${opt.value}`}
                                name="condizioneOccupazionale"
                                data-field="condizione_occupazionale"
                                value={opt.value}
                                checked={participantForm.condizioneOccupazionale === opt.value}
                                onChange={(event) => setParticipantForm((prev) => ({ ...prev, condizioneOccupazionale: event.target.value }))}
                              />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {Object.keys(participantErrors).length > 0 && (
                    <div className="alert alert-danger mt-3 mb-0">
                      {participantErrors.limite || 'Correggi i campi obbligatori evidenziati in rosso.'}
                    </div>
                  )}
                  {botError && <div className="alert alert-danger mt-3 mb-0" role="alert">{botError}</div>}
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button type="button" className="btn text-white" style={{ backgroundColor: '#5890ff' }} onClick={handleSaveParticipant}>
                      {editingParticipantId ? 'Aggiorna' : 'Salva'}
                    </button>
                    <button type="button" className="btn text-white" style={{ backgroundColor: '#f0ad4e' }} onClick={handleCancelParticipantForm}>
                      Annulla
                    </button>
                  </div>
                </div>
              )}

              {participants.length > 0 && (
                <table className="table table-sm table-bordered" style={{ fontSize: '0.75rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>N.</th>
                      <th>Nome</th>
                      <th>Cognome</th>
                      <th>Luogo di nascita</th>
                      <th>Data di nascita</th>
                      <th>Codice Fiscale</th>
                      <th>Stato soggetto</th>
                      <th>Categoria Protetta (Disabile)</th>
                      <th>Provincia</th>
                      <th>Data selezione</th>
                      <th style={{ width: '160px' }}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.nome || '-'}</td>
                        <td>{item.cognome || '-'}</td>
                        <td>{item.comuneNascita || item.altroComuneNascita || '-'}</td>
                        <td>
                          <div>{formatDate(item.dataNascita)}</div>
                          <div style={{ fontSize: '0.68rem', color: '#555' }}>(anni all'iscrizione: {getAgeAtDate(item.dataNascita, item.dataSelezione)})</div>
                        </td>
                        <td>{item.codiceFiscale || '-'}</td>
                        <td>{getOccupationText(item.condizioneOccupazionale)}</td>
                        <td>{item.disabile || 'No'}</td>
                        <td>{item.residenzaProvincia || item.provinciaNascita || '-'}</td>
                        <td>{formatDate(item.dataSelezione)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm text-white"
                              style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                              onClick={() => handleEditParticipant(item)}
                            >
                              ✏ Modifica
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteParticipant(item.id)}
                            >
                              Elimina
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === 'personale' && (
          <div className="card border-0 rounded-0 shadow-sm mb-5">
            <div className="card-header border-0 rounded-0 p-2 text-white" style={{ backgroundColor: '#d71920', fontWeight: 600 }}>Personale non docente</div>
            <div className="card-body p-4">
              {!showStaffForm ? (
                <>
                  <div className="d-flex mb-3">
                    <button
                      type="button"
                      className="btn text-white"
                      style={{ backgroundColor: '#d9534f' }}
                      onClick={() => {
                        setStaffForm(EMPTY_STAFF);
                        setStaffErrors({});
                        setShowStaffForm(true);
                      }}
                    >
                      Aggiungi personale non docente +
                    </button>
                  </div>
                  {staff.length > 0 ? (
                    <table className="table table-sm table-bordered" style={{ fontSize: '0.75rem' }}>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Cognome</th>
                          <th>Codice Fiscale</th>
                          <th>Telefono</th>
                          <th>Email</th>
                          <th>Data nascita</th>
                          <th>Ruolo</th>
                          <th>Personale esterno</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{item.cognome}</td>
                            <td>{item.codiceFiscale}</td>
                            <td>{item.telefono}</td>
                            <td>{item.email}</td>
                            <td>{formatDate(item.dataNascita)}</td>
                            <td>{item.ruolo}</td>
                            <td>{item.personaleEsterno || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="mb-3 text-muted" style={{ fontSize: '0.85rem' }}>Nessun valore in lista</div>
                  )}
                  <div className="alert" style={{ backgroundColor: '#fdbd83', border: '1px solid #f0ad4e', fontSize: '0.75rem' }}>
                    Obbligatorio individuare REO, Direttore, Tutor e Personale amministrativo. Ruoli trovati: {requiredRoles.length - missingRoles.length}/{requiredRoles.length}. {missingRoles.length > 0 && `Mancanti: ${missingRoles.join(', ')}`}
                  </div>
                </>
              ) : (
                <div className="border p-3">
                  <div className="mb-3" style={{ fontSize: '1.1rem', color: '#333' }}>
                    <strong>Aggiungi personale</strong>
                  </div>
                  <div className="mb-3" style={{ fontSize: '0.95rem' }}>
                    • riempiendo la scheda anagrafica e salvando i dati inseriti.
                  </div>
                  <div className="d-flex justify-content-end gap-2 mb-3">
                    <button
                      type="button"
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: '#5890ff' }}
                      onClick={() => {
                        setStaffForm(EMPTY_STAFF);
                        setShowStaffForm(false);
                        setStaffErrors({});
                      }}
                    >
                      indietro
                    </button>
                    <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: '#5890ff' }} onClick={handleSaveStaff}>
                      Salva
                    </button>
                  </div>
                  <HoneypotField onFill={triggerHoneypot} />
                  {botError && <div className="alert alert-danger mb-2" role="alert">{botError}</div>}
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Nome &#9888;</label><input name="nome" data-field="nome" type="text" className="form-control" value={staffForm.nome} onChange={(event) => setStaffForm((prev) => ({ ...prev, nome: event.target.value }))} onKeyDown={trackKey} style={{ borderColor: staffErrors.nome ? '#d9534f' : '#d7a3a3' }} /></div>
                    <div className="col-md-6"><label className="form-label">Cognome &#9888;</label><input name="cognome" data-field="cognome" type="text" className="form-control" value={staffForm.cognome} onChange={(event) => setStaffForm((prev) => ({ ...prev, cognome: event.target.value }))} onKeyDown={trackKey} style={{ borderColor: staffErrors.cognome ? '#d9534f' : '#d7a3a3' }} /></div>

                    <div className="col-md-6"><label className="form-label">Codice Fiscale &#9888;</label><input name="codice_fiscale" data-field="codice_fiscale" type="text" className="form-control" value={staffForm.codiceFiscale} onChange={(event) => setStaffForm((prev) => ({ ...prev, codiceFiscale: event.target.value }))} onKeyDown={trackKey} style={{ borderColor: staffErrors.codiceFiscale ? '#d9534f' : '#d7a3a3' }} /></div>
                    <div className="col-md-6"><label className="form-label">Telefono &#9888;</label><input name="telefono" data-field="telefono" type="text" className="form-control" value={staffForm.telefono} onChange={(event) => setStaffForm((prev) => ({ ...prev, telefono: event.target.value }))} onKeyDown={trackKey} style={{ borderColor: staffErrors.telefono ? '#d9534f' : '#d7a3a3' }} /></div>

                    <div className="col-md-4"><label className="form-label">Email &#9888;</label><input name="email" data-field="email" type="email" className="form-control" value={staffForm.email} onChange={(event) => setStaffForm((prev) => ({ ...prev, email: event.target.value }))} onKeyDown={trackKey} style={{ borderColor: staffErrors.email ? '#d9534f' : '#d7a3a3' }} /></div>
                    <div className="col-md-4"><label className="form-label">Data di nascita &#9888;</label><input name="data_nascita" data-field="data_nascita" type="text" inputMode="numeric" autoComplete="off" placeholder="ggmmaaaa" title={DATE_INPUT_HINT} className="form-control" value={staffForm.dataNascita} onChange={(event) => setStaffForm((prev) => ({ ...prev, dataNascita: event.target.value }))} onKeyDown={trackKey} style={{ borderColor: staffErrors.dataNascita ? '#d9534f' : '#d7a3a3' }} /></div>
                    <div className="col-md-2"><label className="form-label">Ruolo &#9888;</label><select name="ruolo" data-field="ruolo" className="form-select" value={staffForm.ruolo} onChange={(event) => setStaffForm((prev) => ({ ...prev, ruolo: event.target.value }))} style={{ borderColor: staffErrors.ruolo ? '#d9534f' : '#d7a3a3' }}><option value="">Seleziona un'opzione</option>{STAFF_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select></div>
                    <div className="col-md-2"><label className="form-label">Personale esterno &#9888;</label><select name="personale_esterno" data-field="personale_esterno" className="form-select" value={staffForm.personaleEsterno} onChange={(event) => setStaffForm((prev) => ({ ...prev, personaleEsterno: event.target.value }))} style={{ borderColor: staffErrors.personaleEsterno ? '#d9534f' : '#d7a3a3' }}><option value="">Seleziona un'opzione</option>{STAFF_EXTERNAL_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
                  </div>
                  {Object.keys(staffErrors).length > 0 && <div className="alert alert-danger mt-3 mb-0">Correggi i campi evidenziati prima di salvare.</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stage' && (
          <>
            <div className="card border-0 rounded-0 shadow-sm mb-4">
              <div className="card-header border-0 rounded-0 p-2 text-white" style={{ backgroundColor: '#d71920', fontWeight: 600 }}>Dettaglio STAGE</div>
              <div className="card-body p-3">
                <div className="row g-3 mb-2">
                  <div className="col-md-2">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Ore Stage</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={stageForm.oreStage}
                      disabled
                      readOnly
                      style={{ borderColor: '#ccc', backgroundColor: '#f3f3f3' }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Data avvio prevista</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="ggmmaaaa"
                      title={DATE_INPUT_HINT}
                      name="data_avvio_stage"
                      data-field="data_avvio_stage"
                      className="form-control form-control-sm"
                      value={stageForm.dataAvvio}
                      onChange={(event) => {
                        setStageForm((prev) => ({ ...prev, dataAvvio: event.target.value }));
                        setStageFeedback('');
                      }}
                      style={{ borderColor: stageErrors.dataAvvio ? '#d9534f' : '#ccc' }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Data fine prevista</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="ggmmaaaa"
                      title={DATE_INPUT_HINT}
                      name="data_fine_stage"
                      data-field="data_fine_stage"
                      className="form-control form-control-sm"
                      value={stageForm.dataFine}
                      onChange={(event) => {
                        setStageForm((prev) => ({ ...prev, dataFine: event.target.value }));
                        setStageFeedback('');
                      }}
                      style={{ borderColor: stageErrors.dataFine ? '#d9534f' : '#ccc' }}
                    />
                  </div>
                </div>

                <div className="p-2 mb-2" style={{ backgroundColor: '#e9f2ff', border: '1px solid #d2e3ff', fontSize: '0.72rem', fontWeight: 600 }}>
                  Giornate di stage previste considerando la durata formativa minima di 4 ore e massima di 8 ore giornaliere
                </div>

                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Numero giornate minimo</label>
                    <input type="number" className="form-control form-control-sm" value={stageBounds.min} disabled readOnly style={{ backgroundColor: '#f3f3f3', borderColor: '#ccc' }} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Numero giornate massimo</label>
                    <input type="number" className="form-control form-control-sm" value={stageBounds.max} disabled readOnly style={{ backgroundColor: '#f3f3f3', borderColor: '#ccc' }} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Giornate Stage</label>
                    <input
                      name="giornate_stage"
                      data-field="giornate_stage"
                      type="number"
                      className="form-control form-control-sm"
                      value={stageForm.giornateStage}
                      onChange={(event) => {
                        setStageForm((prev) => ({ ...prev, giornateStage: event.target.value }));
                        setStageFeedback('');
                      }}
                      style={{ borderColor: stageErrors.giornateStage ? '#d9534f' : '#ccc' }}
                    />
                  </div>
                  <div className="col-md-3 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: '#5890ff' }} onClick={handleSaveStage}>SALVA</button>
                    <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: '#f0ad4e' }} onClick={handleCancelStage}>Annulla</button>
                  </div>
                </div>

                {Object.keys(stageErrors).length > 0 && (
                  <div className="alert alert-danger mt-3 mb-0">Correggi i campi stage evidenziati prima di salvare.</div>
                )}
                {stageFeedback && (
                  <div className="alert alert-success mt-3 mb-0">{stageFeedback}</div>
                )}
              </div>
            </div>

            <div className="card border-0 rounded-0 shadow-sm mb-5">
              <div className="card-header border-0 rounded-0 p-2 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#4f8fe8', fontWeight: 600 }}>
                <span>Imprese/Enti</span>
                {!showHostForm && (
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{ backgroundColor: '#5890ff' }}
                    onClick={() => {
                      setHostForm(EMPTY_HOST);
                      setHostErrors({});
                      setShowHostForm(true);
                    }}
                  >
                    +Aggiungi Impresa/Ente
                  </button>
                )}
              </div>
              <div className="card-body p-3">
                {!showHostForm ? (
                  <table className="table table-sm table-bordered mb-0" style={{ fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th>Denominazione</th>
                        <th>Partita IVA</th>
                        <th>Sede legale</th>
                        <th>Sede operativa</th>
                        <th>Numero Allievi Stagisti Previsti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hosts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-muted">Nessun elemento</td>
                        </tr>
                      ) : (
                        hosts.map((host) => (
                          <tr key={host.id}>
                            <td>{host.denominazione}</td>
                            <td>{host.partitaIva}</td>
                            <td>{host.sedeLegale}</td>
                            <td>{host.sedeOperativa}</td>
                            <td>{host.allievi}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="border">
                    <div className="px-2 py-1 text-white" style={{ backgroundColor: '#4f8fe8', fontSize: '0.85rem', fontWeight: 600 }}>
                      Aggiungi Impresa/Ente
                    </div>
                    <div className="p-3">
                      <HoneypotField onFill={triggerHoneypot} />
                      {botError && <div className="alert alert-danger mb-2" role="alert">{botError}</div>}
                      <div className="row g-3 mb-3">
                        <div className="col-md-8">
                          <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Denominazione completa</label>
                          <input
                            name="denominazione_completa"
                            data-field="denominazione_completa"
                            type="text"
                            className="form-control form-control-sm"
                            value={hostForm.denominazione}
                            onChange={(event) => setHostForm((prev) => ({ ...prev, denominazione: event.target.value }))}
                            onKeyDown={trackKey}
                            style={{ borderColor: hostErrors.denominazione ? '#d9534f' : '#d7a3a3' }}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>PIVA</label>
                          <input
                            name="piva"
                            data-field="piva"
                            type="text"
                            className="form-control form-control-sm"
                            value={hostForm.partitaIva}
                            onChange={(event) => setHostForm((prev) => ({ ...prev, partitaIva: event.target.value }))}
                            onKeyDown={trackKey}
                            style={{ borderColor: hostErrors.partitaIva ? '#d9534f' : '#d7a3a3' }}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Numero allievi ospitabili</label>
                          <input
                            name="numero_allievi"
                            data-field="numero_allievi"
                            type="number"
                            className="form-control form-control-sm"
                            value={hostForm.allievi}
                            onChange={(event) => setHostForm((prev) => ({ ...prev, allievi: event.target.value }))}
                            style={{ borderColor: hostErrors.allievi ? '#d9534f' : '#d7a3a3' }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="pb-1 mb-2" style={{ fontWeight: 600, borderBottom: '1px solid #e5e5e5' }}>Indirizzo completo sede legale</div>
                        <div className="row g-3">
                          <div className="col-md-2">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Provincia</label>
                            <select name="sede_legale_provincia" data-field="sede_legale_provincia" className="form-select form-select-sm" value={hostForm.legaleProvincia} onChange={(event) => setHostForm((prev) => ({ ...prev, legaleProvincia: event.target.value }))} style={{ borderColor: hostErrors.legaleProvincia ? '#d9534f' : '#d7a3a3' }}>
                              <option value="">--</option>
                              {PROVINCES.map((province) => <option key={province} value={province}>{getProvinceOptionLabel(province)}</option>)}
                            </select>
                          </div>
                          <div className="col-md-2">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Comune</label>
                            <select name="sede_legale_comune" data-field="sede_legale_comune" className="form-select form-select-sm" value={hostForm.legaleComune} onChange={(event) => setHostForm((prev) => ({ ...prev, legaleComune: event.target.value }))} style={{ borderColor: hostErrors.legaleComune ? '#d9534f' : '#d7a3a3' }}>
                              <option value="">Seleziona Provincia</option>
                              {(COMUNI_BY_PROVINCE[hostForm.legaleProvincia] || []).map((city) => <option key={`legale-${city}`} value={city}>{city}</option>)}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Indirizzo</label>
                            <input
                              name="sede_legale_indirizzo"
                              data-field="sede_legale_indirizzo"
                              type="text"
                              className="form-control form-control-sm"
                              value={hostForm.legaleIndirizzo}
                              onChange={(event) => setHostForm((prev) => ({ ...prev, legaleIndirizzo: event.target.value }))}
                              onKeyDown={trackKey}
                              style={{ borderColor: hostErrors.legaleIndirizzo ? '#d9534f' : '#d7a3a3' }}
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>N° civico</label>
                            <input
                              name="sede_legale_n_civico"
                              data-field="sede_legale_n_civico"
                              type="text"
                              className="form-control form-control-sm"
                              value={hostForm.legaleCivico}
                              onChange={(event) => setHostForm((prev) => ({ ...prev, legaleCivico: event.target.value }))}
                              onKeyDown={trackKey}
                              style={{ borderColor: hostErrors.legaleCivico ? '#d9534f' : '#d7a3a3' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="pb-1 mb-2" style={{ fontWeight: 600, borderBottom: '1px solid #e5e5e5' }}>Indirizzo completo sede operativa (se diversa da sede legale)</div>
                        <div className="row g-3">
                          <div className="col-md-2">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Provincia</label>
                            <select name="sede_operativa_provincia" data-field="sede_operativa_provincia" className="form-select form-select-sm" value={hostForm.operativaProvincia} onChange={(event) => setHostForm((prev) => ({ ...prev, operativaProvincia: event.target.value }))}>
                              <option value="">--</option>
                              {PROVINCES.map((province) => <option key={`op-${province}`} value={province}>{getProvinceOptionLabel(province)}</option>)}
                            </select>
                          </div>
                          <div className="col-md-2">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Comune</label>
                            <select name="sede_operativa_comune" data-field="sede_operativa_comune" className="form-select form-select-sm" value={hostForm.operativaComune} onChange={(event) => setHostForm((prev) => ({ ...prev, operativaComune: event.target.value }))}>
                              <option value="">Seleziona Provincia</option>
                              {(COMUNI_BY_PROVINCE[hostForm.operativaProvincia] || []).map((city) => <option key={`operativa-${city}`} value={city}>{city}</option>)}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Indirizzo</label>
                            <input name="sede_operativa_indirizzo" data-field="sede_operativa_indirizzo" type="text" className="form-control form-control-sm" value={hostForm.operativaIndirizzo} onChange={(event) => setHostForm((prev) => ({ ...prev, operativaIndirizzo: event.target.value }))} onKeyDown={trackKey} />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>N° civico</label>
                            <input name="sede_operativa_n_civico" data-field="sede_operativa_n_civico" type="text" className="form-control form-control-sm" value={hostForm.operativaCivico} onChange={(event) => setHostForm((prev) => ({ ...prev, operativaCivico: event.target.value }))} onKeyDown={trackKey} />
                          </div>
                        </div>
                      </div>

                      {Object.keys(hostErrors).length > 0 && <div className="alert alert-danger mt-3 mb-0">Correggi i campi evidenziati prima di salvare.</div>}
                    </div>
                    <div className="d-flex justify-content-end gap-2 p-2 border-top">
                      <button type="button" className="btn text-white" style={{ backgroundColor: '#5890ff' }} onClick={handleSaveHost}>Salva</button>
                      <button
                        type="button"
                        className="btn text-white"
                        style={{ backgroundColor: '#f0ad4e' }}
                        onClick={() => {
                          setHostForm(EMPTY_HOST);
                          setHostErrors({});
                          setShowHostForm(false);
                        }}
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'verifica' && (
          <div className="card shadow-sm mb-5" style={{ border: '1px solid #5890ff' }}>
            <div className="card-header border-0 rounded-0 p-2 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#5890ff' }}>
              <span>Verifica e conferma progettazione esecutiva - Riferimento percorso {edition.id}</span>
              <HintBadge text="Tutti i controlli devono risultare OK per poter confermare. Dopo la conferma potrai firmare la P.E. e poi procedere alla richiesta risorse." position="left" />
            </div>
            <div className="card-body p-4">
              {edition.status === 'draft' && (
                <>
                  {allValid && <div className="alert alert-success">La progettazione non presenta errori: puoi confermare.</div>}
                  <div className="list-group list-group-flush border mb-3">
                    <div className="list-group-item d-flex justify-content-between"><span>Dettaglio percorso</span><span style={{ color: hasDettaglioErrors ? '#d9534f' : '#4caf50' }}>{hasDettaglioErrors ? 'KO' : 'OK'}</span></div>
                    <div className="list-group-item d-flex justify-content-between"><span>Partecipanti (minimo 8 - massimo 15)</span><span style={{ color: hasPartecipantiErrors ? '#d9534f' : '#4caf50' }}>{hasPartecipantiErrors ? 'KO' : 'OK'}</span></div>
                    <div className="list-group-item d-flex justify-content-between"><span>Personale obbligatorio</span><span style={{ color: hasPersonaleErrors ? '#d9534f' : '#4caf50' }}>{hasPersonaleErrors ? 'KO' : 'OK'}</span></div>
                    <div className="list-group-item d-flex justify-content-between"><span>Imprese stage</span><span style={{ color: hasStageErrors ? '#d9534f' : '#4caf50' }}>{hasStageErrors ? 'KO' : 'OK'}</span></div>
                    <div className="list-group-item d-flex justify-content-between"><span>Limite disabili (max 20% allievi iscritti)</span><span style={{ color: hasDisabiliExceeded ? '#d9534f' : '#4caf50' }}>{hasDisabiliExceeded ? 'KO' : 'OK'}</span></div>
                  </div>
                  <div className="d-flex justify-content-center"><button type="button" className="btn text-white" style={{ backgroundColor: '#57e112' }} disabled={!allValid} onClick={() => setEditionVerification(activeEditionId, 'confirmed')}>CONFERMA</button></div>
                </>
              )}

              {edition.status === 'confirmed' && (
                <div className="text-center">
                  <h5 className="mb-4">La P.E. e' stata chiusa in data {formatDateTime(editionData.verification?.updatedAt)}</h5>
                  <div className="d-flex justify-content-center gap-2">
                    <button type="button" className="btn text-white" style={{ backgroundColor: '#eaa236' }} onClick={() => setEditionVerification(activeEditionId, 'draft')}>RIAPRI P.E.</button>
                    <button type="button" className="btn text-white" style={{ backgroundColor: '#d9534f' }} disabled={!allValid} onClick={() => setEditionVerification(activeEditionId, 'signed')}>FIRMA P.E.</button>
                  </div>
                </div>
              )}

              {(edition.status === 'signed' || edition.status === 'requested') && (
                <div>
                  <div className="alert alert-success">
                    La P.E. e' stata firmata in data {formatDateTime(editionData.verification?.updatedAt)}.
                  </div>
                  {edition.status === 'signed' ? (
                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-danger" onClick={() => navigateTo('richiesta', { courseId: course.id, editionId: edition.id })}>
                        Vai a Richiesta risorse
                      </button>
                    </div>
                  ) : (
                    <div className="alert alert-info mb-0">
                      Le risorse sono gia' state richieste in data {formatDateTime(edition.requestedAt)}.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showResetConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', borderRadius: '10px', padding: '28px 32px',
            maxWidth: '420px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc3545' }}>Azzera tutti i dati?</h3>
            <p style={{ color: '#555', marginBottom: '24px' }}>
              Questa azione elimina in modo definitivo tutti i partecipanti, il personale,
              i dati di stage e i dettagli dell&apos;edizione attiva. Non è reversibile.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                style={{ padding: '8px 22px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => {
                  resetEditionData(activeEditionId);
                  setActiveTab('dettaglio');
                  setShowResetConfirm(false);
                }}
                style={{ padding: '8px 22px', borderRadius: '6px', border: 'none',
                         background: '#dc3545', color: 'white', cursor: 'pointer', fontWeight: '600' }}
              >
                Sì, azzera tutto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgettazioneDettagli;

