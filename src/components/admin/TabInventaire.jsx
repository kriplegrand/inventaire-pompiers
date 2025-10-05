// src/components/admin/TabInventaire.jsx
import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { DB } from '../../services/db';

export default function TabInventaire({ onSelectCamion }) {
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
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Inventaire des Camions</h2>
      <p className="text-gray-600 mb-6">Effectuez un contrôle d'inventaire en tant qu'administrateur</p>

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
              onClick={() => onSelectCamion(c)}
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
  );
}