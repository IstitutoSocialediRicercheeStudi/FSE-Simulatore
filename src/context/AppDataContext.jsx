import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppDataContext } from './useAppData.js';

const STORAGE_KEY = 'fse_portal_state_v2';
const USERS_DB_KEY = 'fse_users_db';
const LEADERBOARD_KEY = 'fse_leaderboard';
const STORAGE_VERSION = 2;

const REQUIRED_ROLES = ['REO', 'Direttore', 'Tutor', 'Personale Amministrativo'];

const EMPTY_EDITION_DATA = {
  detail: {
    dataAvvio: '',
    dataFine: '',
    importo: '',
    address: 'CORSO VITTORIO EMANUELE',
    civic: '197',
    cap: '93012',
    city: 'GELA',
    province: 'CL',
    maxMonths: '6',
    classroomCapacity: '20',
    minDays8h: '69',
    maxDays4h: '139',
    stageHours: '400',
    stageDataAvvio: '',
    stageDataFine: '',
    stageMinDays: '50',
    stageMaxDays: '100',
    stageDays: '0',
    giornateAulaPreviste: '',
    oreFasciaA: '',
    oreFasciaB: '',
    oreFasciaC: ''
  },
  participants: [],
  staff: [],
  hosts: [],
  verification: {
    updatedAt: null
  }
};

function cloneEditionData(data = EMPTY_EDITION_DATA) {
  return {
    detail: {
      ...EMPTY_EDITION_DATA.detail,
      ...(data.detail || {})
    },
    participants: Array.isArray(data.participants) ? [...data.participants] : [],
    staff: Array.isArray(data.staff) ? [...data.staff] : [],
    hosts: Array.isArray(data.hosts) ? [...data.hosts] : [],
    verification: {
      updatedAt: data.verification?.updatedAt || null
    }
  };
}

function createDefaultCourses() {
  return [
    {
      id: '5614',
      title: "Assistente all'autonomia ed alla comunicazione dei disabili",
      area: 'SERVIZI ALLA PERSONA',
      sub: 'Servizi socio-sanitari',
      eqf: '4',
      istanzaId: '631',
      editions: [
        {
          id: 'CS5614-ED23968',
          name: 'Edizione Palermo',
          hours: '754',
          address: 'Via Aquileia n.32 90144 Palermo(PA)',
          prov: 'PA',
          status: 'draft',
          requestedAt: null
        }
      ]
    },
    {
      id: '5615',
      title: 'Assistente di studio odontoiatrico',
      area: 'SERVIZI ALLA PERSONA',
      sub: 'Servizi socio-sanitari',
      eqf: '3',
      istanzaId: '631',
      editions: [
        {
          id: 'CS5615-ED23970',
          name: 'Edizione Palermo A',
          hours: '754',
          address: 'Via Aquileia n.32 90144 Palermo(PA)',
          prov: 'PA',
          status: 'draft',
          requestedAt: null
        },
        {
          id: 'CS5615-ED23971',
          name: 'Edizione Palermo B',
          hours: '754',
          address: 'Via Aquileia n.32 90144 Palermo(PA)',
          prov: 'PA',
          status: 'draft',
          requestedAt: null
        },
        {
          id: 'CS5615-ED23972',
          name: 'Edizione Palermo C',
          hours: '754',
          address: 'Via Aquileia n.32 90144 Palermo(PA)',
          prov: 'PA',
          status: 'draft',
          requestedAt: null
        }
      ]
    },
    {
      id: '5617',
      title: 'Assistente alla struttura educativa',
      area: 'SERVIZI ALLA PERSONA',
      sub: 'Servizi di educazione e formazione',
      eqf: '2',
      istanzaId: '631',
      editions: [
        {
          id: 'CS5617-ED23973',
          name: 'Edizione Catania',
          hours: '754',
          address: 'Via Etnea 210 95100 Catania(CT)',
          prov: 'CT',
          status: 'draft',
          requestedAt: null
        }
      ]
    },
    {
      id: '5618',
      title: 'Tecnico di sviluppo software',
      area: 'CULTURA INFORMAZIONE E TECNOLOGIE INFORMATICHE',
      sub: 'Servizi di Informatica',
      eqf: '5',
      istanzaId: '631',
      editions: [
        {
          id: 'CS5618-ED23974',
          name: 'Edizione Messina',
          hours: '754',
          address: 'Via Consolato del Mare 45 98100 Messina(ME)',
          prov: 'ME',
          status: 'draft',
          requestedAt: null
        }
      ]
    },
    {
      id: '5619',
      title: 'Addetto vendite',
      area: 'SERVIZI COMMERCIALI',
      sub: 'Area comune (inclusiva dei servizi alle imprese)',
      eqf: '2',
      istanzaId: '631',
      editions: [
        {
          id: 'CS5619-ED23975',
          name: 'Edizione Siracusa',
          hours: '754',
          address: 'Viale Teocrito 12 96100 Siracusa(SR)',
          prov: 'SR',
          status: 'draft',
          requestedAt: null
        }
      ]
    },
    {
      id: '5620',
      title: 'Addetto amministrativo segretariale',
      area: 'SERVIZI COMMERCIALI',
      sub: 'Area comune (inclusiva dei servizi alle imprese)',
      eqf: '2',
      istanzaId: '631',
      editions: [
        {
          id: 'CS5620-ED23976',
          name: 'Edizione Trapani',
          hours: '754',
          address: 'Via Fardella 80 91100 Trapani(TP)',
          prov: 'TP',
          status: 'draft',
          requestedAt: null
        }
      ]
    }
  ];
}

function buildEditionDataIndex(courses) {
  const editionData = {};
  courses.forEach((course) => {
    course.editions.forEach((edition) => {
      editionData[edition.id] = cloneEditionData();
    });
  });
  return editionData;
}

function createDefaultPortalState() {
  const courses = createDefaultCourses();
  return {
    version: STORAGE_VERSION,
    courses,
    editionData: buildEditionDataIndex(courses),
    activeCourseId: null,
    activeEditionId: null
  };
}

function parseStoredValue(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null) return fallback;
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

function findCourseByEdition(courses, editionId) {
  return courses.find((course) => course.editions.some((edition) => edition.id === editionId)) || null;
}

function normalizeStatus(statusValue) {
  if (statusValue === 'requested' || statusValue === 'signed' || statusValue === 'confirmed') {
    return statusValue;
  }
  return 'draft';
}

function mergeWithDefaultState(partialState) {
  const defaults = createDefaultPortalState();
  const state = partialState && typeof partialState === 'object' ? partialState : {};

  const courseMap = new Map();
  (state.courses || []).forEach((course) => {
    if (course?.id) courseMap.set(course.id, course);
  });

  const mergedCourses = defaults.courses.map((defaultCourse) => {
    const savedCourse = courseMap.get(defaultCourse.id);
    if (!savedCourse) return defaultCourse;

    const savedEditionMap = new Map();
    (savedCourse.editions || []).forEach((edition) => {
      if (edition?.id) savedEditionMap.set(edition.id, edition);
    });

    return {
      ...defaultCourse,
      ...savedCourse,
      editions: defaultCourse.editions.map((defaultEdition) => {
        const savedEdition = savedEditionMap.get(defaultEdition.id);
        if (!savedEdition) return defaultEdition;
        return {
          ...defaultEdition,
          ...savedEdition,
          status: normalizeStatus(savedEdition.status),
          requestedAt: savedEdition.requestedAt || null
        };
      })
    };
  });

  const defaultEditionData = buildEditionDataIndex(mergedCourses);
  const mergedEditionData = { ...defaultEditionData };

  Object.entries(state.editionData || {}).forEach(([editionId, data]) => {
    if (!mergedEditionData[editionId]) return;
    mergedEditionData[editionId] = cloneEditionData(data);
  });

  const hasActiveCourse = mergedCourses.some((course) => course.id === state.activeCourseId);
  const activeCourseId = hasActiveCourse ? state.activeCourseId : null;
  const activeCourse = hasActiveCourse ? mergedCourses.find((course) => course.id === state.activeCourseId) : null;
  const hasActiveEdition = activeCourse?.editions?.some((edition) => edition.id === state.activeEditionId);

  return {
    version: STORAGE_VERSION,
    courses: mergedCourses,
    editionData: mergedEditionData,
    activeCourseId,
    activeEditionId: hasActiveEdition ? state.activeEditionId : null
  };
}

function migrateLegacyState() {
  const migrated = createDefaultPortalState();

  if (typeof window === 'undefined') {
    return migrated;
  }

  const legacyPercorsi = parseStoredValue('fse_percorsi_editions', []);
  if (Array.isArray(legacyPercorsi) && legacyPercorsi.length > 0) {
    migrated.courses = migrated.courses.map((course) => {
      if (course.id !== '5615') return course;

      return {
        ...course,
        editions: course.editions.map((edition) => {
          const legacyEdition = legacyPercorsi.find((item) => item.id === edition.id);
          if (!legacyEdition) return edition;

          let status = 'draft';
          if (legacyEdition.richiestaRisorse === 'requested') {
            status = 'requested';
          } else if (legacyEdition.statusPE === 'firmata' || legacyEdition.richiestaRisorse === 'to_request') {
            status = 'signed';
          }

          return {
            ...edition,
            status,
            requestedAt: legacyEdition.requestedAt || null,
            address: legacyEdition.address || edition.address,
            prov: legacyEdition.prov || edition.prov,
            hours: legacyEdition.hours || edition.hours
          };
        })
      };
    });
  }

  migrated.editionData = buildEditionDataIndex(migrated.courses);

  const legacyActiveCourseId = parseStoredValue('fse_activeCourseId', null);
  const legacyActiveEditionId = parseStoredValue('fse_activeEditionId', null);

  let targetEditionId = legacyActiveEditionId;
  let targetCourseId = legacyActiveCourseId;

  const targetCourseFromEdition = findCourseByEdition(migrated.courses, targetEditionId);
  if (targetCourseFromEdition) {
    targetCourseId = targetCourseFromEdition.id;
  }

  if (!targetCourseFromEdition && targetCourseId) {
    const selectedCourse = migrated.courses.find((course) => course.id === targetCourseId);
    if (selectedCourse?.editions?.length) {
      targetEditionId = selectedCourse.editions[0].id;
    }
  }

  if (!targetEditionId) {
    const fallbackCourse = migrated.courses.find((course) => course.id === '5615') || migrated.courses[0];
    targetCourseId = fallbackCourse?.id || null;
    targetEditionId = fallbackCourse?.editions?.[0]?.id || null;
  }

  const legacyDetail = {
    dataAvvio: parseStoredValue('fse_pe_dataAvvio', ''),
    dataFine: parseStoredValue('fse_pe_dataFine', ''),
    importo: parseStoredValue('fse_pe_importo', '')
  };

  const hasLegacyDetail = legacyDetail.dataAvvio || legacyDetail.dataFine || legacyDetail.importo;
  const legacyParticipants = parseStoredValue('fse_pe_partecipanti', []);
  const legacyStaff = parseStoredValue('fse_pe_personale', []);
  const legacyHosts = parseStoredValue('fse_pe_imprese', []);
  const legacyVerificationStatus = parseStoredValue('fse_pe_verifica', null);
  const legacyVerificationUpdatedAt = parseStoredValue('fse_pe_verifica_updatedAt', null);

  if (targetEditionId && migrated.editionData[targetEditionId]) {
    const currentEditionData = migrated.editionData[targetEditionId];
    migrated.editionData[targetEditionId] = {
      ...currentEditionData,
      detail: hasLegacyDetail
        ? {
            ...currentEditionData.detail,
            ...legacyDetail
          }
        : currentEditionData.detail,
      participants: Array.isArray(legacyParticipants) ? legacyParticipants : currentEditionData.participants,
      staff: Array.isArray(legacyStaff) ? legacyStaff : currentEditionData.staff,
      hosts: Array.isArray(legacyHosts) ? legacyHosts : currentEditionData.hosts,
      verification: {
        updatedAt: legacyVerificationUpdatedAt || null
      }
    };

    if (legacyVerificationStatus === 'confirmed' || legacyVerificationStatus === 'signed') {
      migrated.courses = migrated.courses.map((course) => ({
        ...course,
        editions: course.editions.map((edition) => {
          if (edition.id !== targetEditionId) return edition;
          return {
            ...edition,
            status: legacyVerificationStatus === 'signed' ? 'signed' : 'confirmed'
          };
        })
      }));
    }
  }

  const activeCourseExists = migrated.courses.some((course) => course.id === targetCourseId);
  migrated.activeCourseId = activeCourseExists ? targetCourseId : null;

  const activeEditionExists = migrated.courses
    .flatMap((course) => course.editions)
    .some((edition) => edition.id === targetEditionId);
  migrated.activeEditionId = activeEditionExists ? targetEditionId : null;

  return migrated;
}

function buildInitialPortalState() {
  if (typeof window === 'undefined') {
    return createDefaultPortalState();
  }

  const savedV2State = parseStoredValue(STORAGE_KEY, null);
  if (savedV2State?.version === STORAGE_VERSION) {
    return mergeWithDefaultState(savedV2State);
  }

  return migrateLegacyState();
}

const ROUTE_MAP = {
  landing: '/',
  login: '/login',
  roles: '/ruoli',
  dashboard: '/dashboard',
  moduli: '/moduli',
  sedi: '/percorsi-sedi',
  progettazione: '/progettazione-esecutiva',
  dettaglioPE: '/progettazione-dettagli',
  richiesta: '/richiesta-risorse',
  risultati: '/risultati',
  classifica: '/classifica'
};

/* ── Users DB helpers ──────────────────────────────────────────────────── */
function loadUsersDb() {
  try {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY)) || {};
  } catch { return {}; }
}

function saveUsersDb(db) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
}

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch { return []; }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function updateEditionInCourses(courses, editionId, updater) {
  return courses.map((course) => ({
    ...course,
    editions: course.editions.map((edition) => {
      if (edition.id !== editionId) return edition;
      return updater(edition);
    })
  }));
}

export function AppDataProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage('fse_user', null);
  const [selectedRole, setSelectedRole] = useLocalStorage('fse_selectedRole', null);
  const [portalState, setPortalState] = useLocalStorage(STORAGE_KEY, buildInitialPortalState);
  const [modulesData, setModulesData] = useLocalStorage('fse_modulesData', {});

  /* ── Timer state ─────────────────────────────────────────────────────── */
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationElapsedMs, setSimulationElapsedMs] = useState(0);
  const timerStartRef = useRef(null);
  const timerFrameRef = useRef(null);

  // Restore timer from user data on mount
  useEffect(() => {
    if (!user?.name) return;
    const db = loadUsersDb();
    const userData = db[user.name.toLowerCase()];
    if (userData?.timerElapsedMs && !userData?.simulationCompleted) {
      setSimulationElapsedMs(userData.timerElapsedMs);
    }
  }, [user?.name]);

  // Timer tick loop
  useEffect(() => {
    if (!simulationActive) {
      if (timerFrameRef.current) cancelAnimationFrame(timerFrameRef.current);
      return;
    }
    const tick = () => {
      if (timerStartRef.current !== null) {
        setSimulationElapsedMs(performance.now() - timerStartRef.current);
      }
      timerFrameRef.current = requestAnimationFrame(tick);
    };
    timerFrameRef.current = requestAnimationFrame(tick);
    return () => { if (timerFrameRef.current) cancelAnimationFrame(timerFrameRef.current); };
  }, [simulationActive]);

  // Persist timer every 5 seconds
  useEffect(() => {
    if (!simulationActive || !user?.name) return;
    const interval = setInterval(() => {
      const db = loadUsersDb();
      const key = user.name.toLowerCase();
      db[key] = { ...(db[key] || {}), timerElapsedMs: simulationElapsedMs };
      saveUsersDb(db);
    }, 5000);
    return () => clearInterval(interval);
  }, [simulationActive, user?.name, simulationElapsedMs]);

  const courses = portalState.courses;
  const activeCourseId = portalState.activeCourseId;
  const activeEditionId = portalState.activeEditionId;
  const editionData = portalState.editionData;

  const setActiveSelection = useCallback(({ courseId, editionId }) => {
    setPortalState((previousState) => {
      const nextState = { ...previousState };

      if (courseId !== undefined) {
        const validCourse = previousState.courses.find((course) => course.id === courseId) || null;
        nextState.activeCourseId = validCourse ? validCourse.id : null;

        if (!validCourse) {
          nextState.activeEditionId = null;
          return nextState;
        }

        if (editionId === undefined) {
          const belongsToCourse = validCourse.editions.some((edition) => edition.id === previousState.activeEditionId);
          if (!belongsToCourse) {
            nextState.activeEditionId = validCourse.editions[0]?.id || null;
          }
        }
      }

      if (editionId !== undefined) {
        const selectedCourseId = nextState.activeCourseId;
        const selectedCourse = previousState.courses.find((course) => course.id === selectedCourseId) || null;
        const validEdition = selectedCourse?.editions?.find((edition) => edition.id === editionId) || null;
        nextState.activeEditionId = validEdition ? validEdition.id : null;
      }

      return nextState;
    });
  }, [setPortalState]);

  const navigateTo = useCallback((page, params = {}) => {
    if (params.courseId !== undefined || params.editionId !== undefined) {
      setActiveSelection({
        courseId: params.courseId,
        editionId: params.editionId
      });
    }

    const targetPath = ROUTE_MAP[page] || ROUTE_MAP.landing;
    navigate(targetPath);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [navigate, setActiveSelection]);

  const login = useCallback((username) => {
    const key = username.trim().toLowerCase();
    if (!key) return;

    const db = loadUsersDb();

    // Always start clean, then restore if user exists
    const freshState = createDefaultPortalState();
    setSelectedRole(null);
    setSimulationActive(false);
    timerStartRef.current = null;
    setSimulationElapsedMs(0);

    if (!db[key]) {
      // New user — register with completely clean state
      db[key] = {
        name: username.trim(),
        createdAt: new Date().toISOString(),
        timerElapsedMs: 0,
        simulationCompleted: false,
        completions: []
      };
      saveUsersDb(db);
      setPortalState(freshState);
      setModulesData({});
    } else {
      // Existing user — restore THEIR data (not leftovers from others)
      const userData = db[key];
      setPortalState(userData.portalState ? mergeWithDefaultState(userData.portalState) : freshState);
      setModulesData(userData.modulesData || {});
      if (userData.selectedRole) {
        setSelectedRole(userData.selectedRole);
      }
      if (userData.timerElapsedMs && !userData.simulationCompleted) {
        setSimulationElapsedMs(userData.timerElapsedMs);
      }
    }

    setUser({ name: db[key].name, cf: 'DEMO00000000000X' });
    navigateTo('dashboard');
  }, [setUser, navigateTo, setPortalState, setModulesData, setSelectedRole]);

  // Save user state periodically
  const saveUserState = useCallback(() => {
    if (!user?.name) return;
    const db = loadUsersDb();
    const key = user.name.toLowerCase();
    db[key] = {
      ...(db[key] || {}),
      name: user.name,
      portalState,
      modulesData,
      selectedRole,
      timerElapsedMs: simulationElapsedMs
    };
    saveUsersDb(db);
  }, [user?.name, portalState, modulesData, selectedRole, simulationElapsedMs]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!user?.name) return;
    const interval = setInterval(saveUserState, 10000);
    return () => clearInterval(interval);
  }, [user?.name, saveUserState]);

  const logout = useCallback(() => {
    // Save current user's data before logout
    if (user?.name) {
      const db = loadUsersDb();
      const key = user.name.toLowerCase();
      db[key] = {
        ...(db[key] || {}),
        name: user.name,
        portalState,
        modulesData,
        selectedRole,
        timerElapsedMs: simulationElapsedMs
      };
      saveUsersDb(db);
    }
    // Stop timer
    setSimulationActive(false);
    timerStartRef.current = null;
    setSimulationElapsedMs(0);

    // Reset everything to clean state
    setUser(null);
    setSelectedRole(null);
    setPortalState(createDefaultPortalState());
    setModulesData({});
    navigateTo('landing');
  }, [setUser, setSelectedRole, setPortalState, setModulesData, navigateTo, user, portalState, modulesData, selectedRole, simulationElapsedMs]);

  /* ── Simulation timer controls ────────────────────────────────────────── */
  const startSimulation = useCallback(() => {
    timerStartRef.current = performance.now() - simulationElapsedMs;
    setSimulationActive(true);
  }, [simulationElapsedMs]);

  const pauseSimulation = useCallback(() => {
    setSimulationActive(false);
    // Persist immediately
    if (user?.name) {
      const db = loadUsersDb();
      const key = user.name.toLowerCase();
      db[key] = { ...(db[key] || {}), timerElapsedMs: simulationElapsedMs };
      saveUsersDb(db);
    }
  }, [user?.name, simulationElapsedMs]);

  const resetSimulation = useCallback(() => {
    setSimulationActive(false);
    setSimulationElapsedMs(0);
    timerStartRef.current = null;
    setPortalState(createDefaultPortalState());
    setModulesData({});
    setSelectedRole(null);
    if (user?.name) {
      const db = loadUsersDb();
      const key = user.name.toLowerCase();
      db[key] = {
        ...(db[key] || {}),
        timerElapsedMs: 0,
        simulationCompleted: false,
        portalState: null,
        modulesData: null,
        selectedRole: null
      };
      saveUsersDb(db);
    }
    navigateTo('dashboard');
  }, [user?.name, setPortalState, setModulesData, setSelectedRole, navigateTo]);

  const getLeaderboard = useCallback(() => {
    return loadLeaderboard();
  }, []);

  const selectRole = useCallback((role) => {
    setSelectedRole(role);
    navigateTo('progettazione');
  }, [setSelectedRole, navigateTo]);

  const getCourseById = useCallback((courseId) => {
    return courses.find((course) => course.id === courseId) || null;
  }, [courses]);

  const getCourseEditions = useCallback((courseId) => {
    const course = getCourseById(courseId);
    return course ? course.editions : [];
  }, [getCourseById]);

  const getActiveCourse = useCallback(() => getCourseById(activeCourseId), [getCourseById, activeCourseId]);

  const getActiveEdition = useCallback(() => {
    const activeCourse = getActiveCourse();
    if (!activeCourse) return null;
    return activeCourse.editions.find((edition) => edition.id === activeEditionId) || null;
  }, [getActiveCourse, activeEditionId]);

  const getEditionData = useCallback((editionId) => {
    if (!editionId) return EMPTY_EDITION_DATA;
    return editionData[editionId] || EMPTY_EDITION_DATA;
  }, [editionData]);

  const getActiveEditionData = useCallback(() => {
    return getEditionData(activeEditionId);
  }, [getEditionData, activeEditionId]);

  const saveEditionDetail = useCallback((editionId, payload) => {
    if (!editionId) return;

    setPortalState((previousState) => {
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();
      const cloned = cloneEditionData(currentEditionData);

      return {
        ...previousState,
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloned,
            detail: {
              ...cloned.detail,
              ...(payload || {})
            }
          }
        }
      };
    });
  }, [setPortalState]);

  const addParticipant = useCallback((editionId, payload) => {
    if (!editionId || !payload) return;

    setPortalState((previousState) => {
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();
      const participants = Array.isArray(currentEditionData.participants) ? currentEditionData.participants : [];

      // Prevent duplicate: skip if a participant with the same codiceFiscale already exists
      if (payload.codiceFiscale && participants.some(p => p.codiceFiscale === payload.codiceFiscale.toUpperCase())) {
        return previousState;
      }

      return {
        ...previousState,
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(currentEditionData),
            participants: [
              ...participants,
              {
                id: payload.id || `PAR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                ...payload
              }
            ]
          }
        }
      };
    });
  }, [setPortalState]);

  const updateParticipant = useCallback((editionId, participantId, payload) => {
    if (!editionId || !participantId || !payload) return;

    setPortalState((previousState) => {
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();
      const participants = Array.isArray(currentEditionData.participants) ? currentEditionData.participants : [];

      return {
        ...previousState,
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(currentEditionData),
            participants: participants.map((participant) => (
              participant.id === participantId
                ? { ...participant, ...payload, id: participant.id }
                : participant
            ))
          }
        }
      };
    });
  }, [setPortalState]);

  const removeParticipant = useCallback((editionId, participantId) => {
    if (!editionId || !participantId) return;

    setPortalState((previousState) => {
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();
      const participants = Array.isArray(currentEditionData.participants) ? currentEditionData.participants : [];

      return {
        ...previousState,
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(currentEditionData),
            participants: participants.filter((participant) => participant.id !== participantId)
          }
        }
      };
    });
  }, [setPortalState]);

  const addStaffMember = useCallback((editionId, payload) => {
    if (!editionId || !payload) return;

    setPortalState((previousState) => {
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();
      const staff = Array.isArray(currentEditionData.staff) ? currentEditionData.staff : [];

      return {
        ...previousState,
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(currentEditionData),
            staff: [
              ...staff,
              {
                id: payload.id || `STAFF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                ...payload
              }
            ]
          }
        }
      };
    });
  }, [setPortalState]);

  const addHostEntity = useCallback((editionId, payload) => {
    if (!editionId || !payload) return;

    setPortalState((previousState) => {
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();
      const hosts = Array.isArray(currentEditionData.hosts) ? currentEditionData.hosts : [];

      return {
        ...previousState,
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(currentEditionData),
            hosts: [
              ...hosts,
              {
                id: payload.id || `HOST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                ...payload
              }
            ]
          }
        }
      };
    });
  }, [setPortalState]);

  const setEditionVerification = useCallback((editionId, status) => {
    if (!editionId) return;
    const normalizedStatus = normalizeStatus(status);

    setPortalState((previousState) => {
      const now = new Date().toISOString();
      const currentEditionData = previousState.editionData[editionId] || cloneEditionData();

      return {
        ...previousState,
        courses: updateEditionInCourses(previousState.courses, editionId, (edition) => ({
          ...edition,
          status: normalizedStatus,
          requestedAt: normalizedStatus === 'requested' ? (edition.requestedAt || now) : null
        })),
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(currentEditionData),
            verification: {
              updatedAt: now
            }
          }
        }
      };
    });
  }, [setPortalState]);

  const requestEditionResources = useCallback((editionId) => {
    if (!editionId) return;

    // Find course info BEFORE updating state
    const course = courses.find(c => c.editions.some(e => e.id === editionId));
    const edition = course?.editions.find(e => e.id === editionId);
    if (!edition || edition.status !== 'signed') return;

    const requestedAt = new Date().toISOString();
    const finalTime = simulationElapsedMs;

    setPortalState((previousState) => {
      return {
        ...previousState,
        courses: updateEditionInCourses(previousState.courses, editionId, (ed) => ({
          ...ed,
          status: 'requested',
          requestedAt
        })),
        editionData: {
          ...previousState.editionData,
          [editionId]: {
            ...cloneEditionData(previousState.editionData[editionId]),
            verification: {
              updatedAt: requestedAt
            }
          }
        }
      };
    });

    // --- Auto-stop timer & save to leaderboard ---
    setSimulationActive(false);
    timerStartRef.current = null;

    if (user?.name && course) {
      // Save to leaderboard with course info
      const board = loadLeaderboard();
      const entryKey = `${user.name.toLowerCase()}_${editionId}`;
      const existing = board.find(e => e.key === entryKey);
      if (existing) {
        if (finalTime < existing.bestTimeMs) {
          existing.bestTimeMs = finalTime;
          existing.completedAt = requestedAt;
        }
        existing.attempts = (existing.attempts || 0) + 1;
      } else {
        board.push({
          key: entryKey,
          username: user.name.toLowerCase(),
          displayName: user.name,
          courseId: course.id,
          courseTitle: course.title,
          editionId: edition.id,
          editionName: edition.name,
          bestTimeMs: finalTime,
          completedAt: requestedAt,
          attempts: 1
        });
      }
      board.sort((a, b) => a.bestTimeMs - b.bestTimeMs);
      saveLeaderboard(board);

      // Save in user db
      const db = loadUsersDb();
      const ukey = user.name.toLowerCase();
      const completions = db[ukey]?.completions || [];
      completions.push({ editionId, courseId: course.id, courseTitle: course.title, editionName: edition.name, elapsedMs: finalTime, completedAt: requestedAt });
      db[ukey] = { ...(db[ukey] || {}), completions, timerElapsedMs: 0 };
      saveUsersDb(db);
    }

    // Reset timer to 0 for next course
    setSimulationElapsedMs(0);
  }, [setPortalState, courses, user?.name, simulationElapsedMs]);

  const resetEditionData = useCallback((editionId) => {
    if (!editionId) return;
    setPortalState((previousState) => ({
      ...previousState,
      courses: updateEditionInCourses(previousState.courses, editionId, (edition) => ({
        ...edition,
        status: 'draft',
        requestedAt: null
      })),
      editionData: {
        ...previousState.editionData,
        [editionId]: cloneEditionData()
      }
    }));
  }, [setPortalState]);

  const updatePeData = useCallback((editionId, tab, data) => {
    if (tab === 'detail') {
      saveEditionDetail(editionId, data);
    }
  }, [saveEditionDetail]);

  const markEditionSigned = useCallback((editionId) => {
    setEditionVerification(editionId, 'signed');
  }, [setEditionVerification]);

  const requestResources = useCallback((editionId) => {
    return requestEditionResources(editionId);
  }, [requestEditionResources]);

  const value = useMemo(() => ({
    user,
    selectedRole,
    courses,
    activeCourseId,
    activeEditionId,
    modulesData,
    requiredRoles: REQUIRED_ROLES,
    simulationActive,
    simulationElapsedMs,
    login,
    logout,
    selectRole,
    navigateTo,
    setActiveSelection,
    getCourseById,
    getCourseEditions,
    getActiveCourse,
    getActiveEdition,
    getEditionData,
    getActiveEditionData,
    setModulesData,
    saveEditionDetail,
    addParticipant,
    updateParticipant,
    removeParticipant,
    addStaffMember,
    addHostEntity,
    setEditionVerification,
    requestEditionResources,
    resetEditionData,
    updatePeData,
    markEditionSigned,
    requestResources,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    getLeaderboard,
    saveUserState
  }), [
    user,
    selectedRole,
    courses,
    activeCourseId,
    activeEditionId,
    modulesData,
    simulationActive,
    simulationElapsedMs,
    login,
    logout,
    selectRole,
    navigateTo,
    setActiveSelection,
    getCourseById,
    getCourseEditions,
    getActiveCourse,
    getActiveEdition,
    getEditionData,
    getActiveEditionData,
    setModulesData,
    saveEditionDetail,
    addParticipant,
    updateParticipant,
    removeParticipant,
    addStaffMember,
    addHostEntity,
    setEditionVerification,
    requestEditionResources,
    resetEditionData,
    updatePeData,
    markEditionSigned,
    requestResources,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    getLeaderboard,
    saveUserState
  ]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
