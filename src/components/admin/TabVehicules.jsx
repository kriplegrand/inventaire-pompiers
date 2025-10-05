// src/components/admin/TabVehicules.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DB } from '../../services/db';

export default function TabVehicules() {
  const [camions, setCamions] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ marque: '', type: '', immatriculation: '' });
  const [error, setError] = useState('');
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

  const handleSubmit = async () => {
    if (!form.marque || !form.type || !form.immatriculation) {
      setError('Tous les champs requis');
      return;
    }

    const exists = camions.find(
      (c) => c.immatriculation === form.immatriculation && c.id !== editing?.id
    );
    if (exists) {
      setError('Immatriculation existe');
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await DB.updateCamion(editing.id, form);
      } else {
        await DB.addCamion(form);
      }
      setForm({ marque: '', type: '', immatriculation: '' });
      setShow(false);
      setEditing(null);
      setError('');
      await loadCamions();
    } catch (err) {
      setError('Erreur: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({ marque: c.marque, type: c.type, immatriculation: c.immatriculation });
    setShow(true);
    setError('');
  };

  const handleDelete = async (c) => {
    if (window.confirm(`Supprimer ${c.immatriculation} ?`)) {
      try {
        await DB.deleteCamion(c.id);
        await loadCamions();
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Gestion des Véhicules</h2>
        {!show && (
          <button
            onClick={() => setShow(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Nouveau
          </button>
        )}
      </div>
      {show && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">
            {editing ? 'Modifier' : 'Nouveau'} Camion
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Marque</label>
              <input
                type="text"
                value={form.marque}
                onChange={(e) => setForm({ ...form, marque: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Immatriculation</label>
              <input
                type="text"
                value={form.immatriculation}
                onChange={(e) =>
                  setForm({ ...form, immatriculation: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 border rounded-lg"
                disabled={submitting}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShow(false);
                  setEditing(null);
                  setForm({ marque: '', type: '', immatriculation: '' });
                  setError('');
                }}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-900 text-white py-2 rounded-lg disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Marque</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">
                  Immatriculation
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {camions.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 sm:px-6 py-4">{c.marque}</td>
                  <td className="px-4 sm:px-6 py-4">{c.type}</td>
                  <td className="px-4 sm:px-6 py-4 font-bold">{c.immatriculation}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}