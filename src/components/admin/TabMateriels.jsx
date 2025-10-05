// src/components/admin/TabMateriels.jsx
import React, { useState, useEffect } from 'react';
import { Truck, Trash2 } from 'lucide-react';
import { DB } from '../../services/db';

export default function TabMateriels() {
  const [camions, setCamions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [equipements, setEquipements] = useState([]);
  const [nom, setNom] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCamions();
  }, []);

  async function loadCamions() {
    const data = await DB.getCamions();
    setCamions(data);
    setLoading(false);
  }

  const loadEquips = async (c) => {
    setSelected(c);
    setLoading(true);
    const data = await DB.getEquipementsByCamion(c.id);
    setEquipements(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!nom.trim()) return;
    setSubmitting(true);
    try {
      await DB.addEquipement({ camionId: selected.id, nom });
      setNom('');
      const data = await DB.getEquipementsByCamion(selected.id);
      setEquipements(data);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet équipement ?')) {
      try {
        await DB.deleteEquipement(id);
        const data = await DB.getEquipementsByCamion(selected.id);
        setEquipements(data);
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    }
  };

  if (loading && !selected) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <button
            onClick={() => setSelected(null)}
            className="text-blue-900 hover:underline mb-4"
          >
            ← Retour
          </button>
          <h2 className="text-xl sm:text-2xl font-bold">
            Équipements de {selected.marque} {selected.type}
          </h2>
          <p className="text-gray-600">{selected.immatriculation}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h3 className="font-bold mb-4">Ajouter un équipement</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !submitting && handleAdd()}
              placeholder="Nom de l'équipement"
              className="flex-1 px-3 py-2 border rounded-lg"
              disabled={submitting}
            />
            <button
              onClick={handleAdd}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 w-full sm:w-auto disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="font-bold mb-4">Liste ({equipements.length})</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
            </div>
          ) : equipements.length === 0 ? (
            <p className="text-gray-600">Aucun équipement.</p>
          ) : (
            <ul className="space-y-2">
              {equipements.map((e) => (
                <li key={e.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="break-all pr-2">{e.nom}</span>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-600 hover:text-red-800 flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Liste des Matériels</h2>
      {camions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Créez d'abord des camions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camions.map((c) => {
            return (
              <div
                key={c.id}
                onClick={() => loadEquips(c)}
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
                  <p className="text-sm text-gray-600">Équipements configurés</p>
                  <p className="font-bold text-blue-900">Cliquez pour gérer</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}