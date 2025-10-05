// src/components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { LogOut, ClipboardList, Truck, Users, Settings } from 
'lucide-react';
import TabInventaire from './TabInventaire';
import TabVehicules from './TabVehicules';
import TabMateriels from './TabMateriels';
import TabUsers from './TabUsers';
import TabConfig from './TabConfig';
import ControleScreen from '../ControleScreen';

function TabButton({ active, onClick, icon: Icon, label, shortLabel }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs 
sm:text-base whitespace-nowrap ${
        active ? 'text-blue-900 border-b-2 border-blue-900' : 
'text-gray-600 hover:text-gray-800'
      }`}
    >
      <Icon className="inline mr-1 sm:mr-2" size={16} />
      <span className="hidden sm:inline">{label}</span>
      <span className="inline sm:hidden">{shortLabel}</span>
    </button>
  );
}

export default function AdminDashboard({ currentUser, onLogout }) {
  const [tab, setTab] = useState('vehicules');
  const [selectedCamion, setSelectedCamion] = useState(null);

  if (tab === 'inventaire' && selectedCamion) {
    return (
      <ControleScreen
        camion={selectedCamion}
        user={currentUser}
        onBack={() => {
          setSelectedCamion(null);
          setTab('inventaire');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row 
justify-between items-start sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">🚒 
Administration</h1>
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="text-blue-200 truncate max-w-[150px] 
sm:max-w-none">
              {currentUser.email}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-blue-800 
hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="overflow-x-auto">
            <div className="flex">
              <TabButton
                active={tab === 'inventaire'}
                onClick={() => setTab('inventaire')}
                icon={ClipboardList}
                label="Inventaire"
                shortLabel="Invent."
              />
              <TabButton
                active={tab === 'vehicules'}
                onClick={() => setTab('vehicules')}
                icon={Truck}
                label="Véhicules"
                shortLabel="Véhic."
              />
              <TabButton
                active={tab === 'materiels'}
                onClick={() => setTab('materiels')}
                icon={ClipboardList}
                label="Matériels"
                shortLabel="Matér."
              />
              <TabButton
                active={tab === 'users'}
                onClick={() => setTab('users')}
                icon={Users}
                label="Utilisateurs"
                shortLabel="Users"
              />
              <TabButton
                active={tab === 'config'}
                onClick={() => setTab('config')}
                icon={Settings}
                label="Configuration"
                shortLabel="Config"
              />
            </div>
          </div>
        </div>
        {tab === 'inventaire' && (
          <TabInventaire onSelectCamion={(camion) => 
setSelectedCamion(camion)} />
        )}
        {tab === 'vehicules' && <TabVehicules />}
        {tab === 'materiels' && <TabMateriels />}
        {tab === 'users' && <TabUsers currentUser={currentUser} />}
        {tab === 'config' && <TabConfig currentUser={currentUser} />}
      </div>
    </div>
  );
}
