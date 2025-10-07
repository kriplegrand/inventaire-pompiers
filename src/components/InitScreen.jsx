// src/components/InitScreen.jsx
import React, { useState } from 'react';
import { DB } from '../services/db';

export default function InitScreen({ onComplete }) {
  const [superAdmin, setSuperAdmin] = useState('');
  const [chef, setChef] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!superAdmin || !chef) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    if (!superAdmin.includes('@') || !chef.includes('@')) {
      setError('Veuillez entrer des adresses email valides');
      setLoading(false);
      return;
    }

    try {
      await DB.setConfig({ 
        initialized: true, 
        emailChefCorps: chef, 
        superAdminEmail: superAdmin 
      });
      
      await DB.addUser({ 
        email: superAdmin, 
        role: 'superadmin', 
        validated: true 
      });
      
      onComplete();
    } catch (err) {
      setError('Erreur: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          🚒 Configuration Initiale
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Super Administrateur
            </label>
            <input
              type="email"
              value={superAdmin}
              onChange={(e) => setSuperAdmin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Chef de Corps
            </label>
            <input
              type="email"
              value={chef}
              onChange={(e) => setChef(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400"
          >
            {loading ? 'Initialisation...' : 'Initialiser'}
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Application offerte par La Panouille-Servian
          </p>
        </div>
      </div>
    </div>
  );
}