// src/components/admin/TabConfig.jsx
import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { DB } from '../../services/db';

export default function TabConfig({ currentUser }) {
  const [config, setConfigState] = useState(null);
  const [emailChef, setEmailChef] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [camionCount, setCamionCount] = useState(0);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    const cfg = await DB.getConfig();
    setConfigState(cfg);
    setEmailChef(cfg.emailChefCorps || '');
    
    const users = await DB.getUsers();
    setUserCount(users.length);
    
    const camions = await DB.getCamions();
    setCamionCount(camions.length);
    
    setLoading(false);
  }

  const handleSaveChefEmail = async () => {
    setSubmitting(true);
    try {
      const cfg = await DB.getConfig();
      await DB.setConfig({ ...cfg, emailChefCorps: emailChef });
      setMessage('Email enregistré');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Erreur: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleUpdateProfile = async () => {
    if (!newEmail) return;
    setSubmitting(true);
    try {
      const cfg = await DB.getConfig();
      await DB.setConfig({ ...cfg, superAdminEmail: newEmail });
      await DB.updateUser(currentUser.id, { email: newEmail });
      setMessage('Profil mis à jour');
      setShowEditProfile(false);
      setNewEmail('');
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setMessage('Erreur: ' + err.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 
border-blue-900"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 
py-3 rounded-lg">
          Erreur: Utilisateur non connecté
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Configuration</h2>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 
px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Email du Chef de 
Corps</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={emailChef}
            onChange={(e) => setEmailChef(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !submitting && 
handleSaveChefEmail()}
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="chef@caserne.fr"
            disabled={submitting}
          />
          <button
            onClick={handleSaveChefEmail}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg 
hover:bg-blue-800 w-full sm:w-auto disabled:bg-gray-400"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {currentUser.role === 'superadmin' && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Profil Super 
Administrateur</h3>
          {!showEditProfile ? (
            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg 
hover:bg-blue-800 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Edit2 size={18} />
              Modifier mon profil
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nouvelle 
adresse email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !submitting && 
handleUpdateProfile()}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={currentUser.email}
                  disabled={submitting}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowEditProfile(false);
                    setNewEmail('');
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 
rounded-lg"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-blue-900 text-white py-2 rounded-lg 
disabled:bg-gray-400"
                  disabled={submitting}
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Informations 
Système</h3>
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex justify-between items-start">
            <span className="text-gray-600">Super Admin:</span>
            <span className="font-medium text-right break-all ml-2">
              {config?.superAdminEmail || 'Non configuré'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Camions:</span>
            <span className="font-medium">{camionCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Utilisateurs:</span>
            <span className="font-medium">{userCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
