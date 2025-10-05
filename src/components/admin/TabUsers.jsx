// src/components/admin/TabUsers.jsx
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DB } from '../../services/db';

export default function TabUsers({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await DB.getUsers();
    setUsers(data);
    setLoading(false);
  }

  const handleAddUser = async () => {
    setError('');
    if (!newUserEmail || !newUserEmail.includes('@')) {
      setError('Email invalide');
      return;
    }
    const exists = users.find((u) => u.email === newUserEmail);
    if (exists) {
      setError('Utilisateur existe déjà');
      return;
    }

    setSubmitting(true);
    try {
      await DB.addUser({ email: newUserEmail, role: newUserRole, validated: true });
      await loadUsers();
      setNewUserEmail('');
      setNewUserRole('user');
      setShowAddForm(false);
    } catch (err) {
      setError('Erreur: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleValidate = async (userId) => {
    try {
      await DB.updateUser(userId, { validated: true });
      await loadUsers();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    if (user.role === 'superadmin') {
      alert('Le super administrateur ne peut pas être supprimé');
      return;
    }
    if (window.confirm(`Supprimer ${user.email} ?`)) {
      try {
        await DB.deleteUser(user.id);
        await loadUsers();
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await DB.updateUser(userId, { role: newRole });
      await loadUsers();
    } catch (err) {
      alert('Erreur: ' + err.message);
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
        <h2 className="text-xl sm:text-2xl font-bold">Gestion des Utilisateurs</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Ajouter
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Ajouter un utilisateur</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !submitting && handleAddUser()}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="utilisateur@caserne.fr"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={submitting}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewUserEmail('');
                  setNewUserRole('user');
                  setError('');
                }}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 bg-blue-900 text-white py-2 rounded-lg disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? 'Ajout...' : 'Ajouter'}
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
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Rôle</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 sm:px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-4 sm:px-6 py-4">
                    {u.role === 'superadmin' ? (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        Super Admin
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2 py-1 border rounded text-xs"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {u.validated ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Validé
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {!u.validated && (
                        <button
                          onClick={() => handleValidate(u.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                        >
                          Valider
                        </button>
                      )}
                      {u.role !== 'superadmin' && (
                        <button
                          onClick={() => handleDelete(u)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                        >
                          Supprimer
                        </button>
                      )}
                      {u.role === 'superadmin' && (
                        <span className="text-gray-400 text-xs italic">Protégé</span>
                      )}
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