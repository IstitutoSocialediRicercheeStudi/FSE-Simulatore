import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgressTracker from './components/ProgressTracker';
import WelcomeModal from './components/WelcomeModal';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Roles from './pages/Roles';
import Dashboard from './pages/Dashboard';
import ModuliFormativi from './pages/ModuliFormativi';
import PercorsiSedi from './pages/PercorsiSedi';
import ProgettazioneEsecutiva from './pages/ProgettazioneEsecutiva';
import ProgettazioneDettagli from './pages/ProgettazioneDettagli';
import RichiestaRisorse from './pages/RichiestaRisorse';
import Risultati from './pages/Risultati';
import Classifica from './pages/Classifica';
import { useAppData } from './context/useAppData.js';

function RequireAuth({ children }) {
  const { user } = useAppData();
  return user ? children : <Navigate to="/login" replace />;
}

function RequireRole({ children }) {
  const { selectedRole } = useAppData();
  return selectedRole ? children : <Navigate to="/ruoli" replace />;
}

function AppRouter() {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Header />
      <ProgressTracker />
      <WelcomeModal />
      <main className="flex-grow-1" style={{backgroundColor: '#f8fafc'}}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ruoli" element={<RequireAuth><Roles /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/moduli" element={<RequireAuth><RequireRole><ModuliFormativi /></RequireRole></RequireAuth>} />
          <Route path="/percorsi-sedi" element={<RequireAuth><RequireRole><PercorsiSedi /></RequireRole></RequireAuth>} />
          <Route path="/progettazione-esecutiva" element={<RequireAuth><RequireRole><ProgettazioneEsecutiva /></RequireRole></RequireAuth>} />
          <Route path="/progettazione-dettagli" element={<RequireAuth><RequireRole><ProgettazioneDettagli /></RequireRole></RequireAuth>} />
          <Route path="/richiesta-risorse" element={<RequireAuth><RequireRole><RichiestaRisorse /></RequireRole></RequireAuth>} />
          <Route path="/risultati" element={<RequireAuth><Risultati /></RequireAuth>} />
          <Route path="/classifica" element={<Classifica />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default AppRouter;
