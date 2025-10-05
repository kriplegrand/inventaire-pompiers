// src/App.jsx
import React, { useState, useEffect } from 'react';
import { DB } from './services/db';
import InitScreen from './components/InitScreen';
import LoginScreen from './components/LoginScreen';
import SelectionScreen from './components/SelectionScreen';
import ControleScreen from './components/ControleScreen';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState('login');
  const [selectedCamion, setSelectedCamion] = useState(null);

  useEffect(() => {
    async function checkInit() {
      const config = await DB.getConfig();
      setInitialized(config.initialized);
      setLoading(false);
    }
    checkInit();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return <InitScreen onComplete={() => setInitialized(true)} />;
  }

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={(user) => {
          setCurrentUser(user);
          setScreen(user.role === 'admin' || user.role === 'superadmin' ? 'admin' : 'selection');
        }}
      />
    );
  }

  if (screen === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setScreen('login');
        }}
      />
    );
  }

  if (screen === 'controle' && selectedCamion) {
    return (
      <ControleScreen
        camion={selectedCamion}
        user={currentUser}
        onBack={() => {
          setSelectedCamion(null);
          setScreen('selection');
        }}
      />
    );
  }

  return (
    <SelectionScreen
      onSelect={(camion) => {
        setSelectedCamion(camion);
        setScreen('controle');
      }}
      onLogout={() => {
        setCurrentUser(null);
        setScreen('login');
      }}
    />
  );
}