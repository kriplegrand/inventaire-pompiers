// src/components/SelectionScreen.jsx
import React, { useState, useEffect } from 'react';
import { Truck, LogOut } from 'lucide-react';
import { DB } from '../services/db';

export default function SelectionScreen({ onSelect, onLogout }) {
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCamions() {
      const data = await DB.getCamions();
      setCamions(data);
      setLoading(false);
    }
    loadCamions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des camions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚒 Sélection du Camion</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </div>
      <div className="flex-1 max-w-6xl mx-auto p-6 w-full">
        <div className="bg-blue-50 border-l-4 border-blue-900 p-4 mb-6">
          <p className="text-blue-900 font-medium">
            👉 Choisissez le camion à inventorier en cliquant sur la carte correspondante
          </p>
        </div>
        {camions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Aucun camion disponible.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camions.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelect(c)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Truck size={40} className="text-blue-900" />
                  <div>
                    <h3 className="font-bold text-lg">{c.marque}</h3>
                    <p className="text-gray-600">{c.type}</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded">
                  <p className="text-sm text-gray-600">Immatriculation</p>
                  <p className="font-bold">{c.immatriculation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-gray-500 text-sm">
          Application offerte par La Panouille-Servian
        </p>
      </div>
    </div>
  );
}