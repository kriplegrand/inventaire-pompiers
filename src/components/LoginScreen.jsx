// src/components/LoginScreen.jsx
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { DB } from '../services/db';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      setMessage('Entrez votre email');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const user = await DB.getUserByEmail(email);
      
      if (!user) {
        await DB.addUser({ email, role: 'user', validated: false });
        setMessage("Votre accès n'a pas encore été validé par un administrateur");
        setIsError(true);
        setLoading(false);
        return;
      }

      if (!user.validated) {
        setMessage("Votre accès n'a pas encore été validé par un administrateur");
        setIsError(true);
        setLoading(false);
        return;
      }

      onLogin(user);
    } catch (error) {
      setMessage('Erreur de connexion: ' + error.message);
      setIsError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          🚒 Inventaire Pompiers
        </h1>
        <p className="text-gray-600 text-center mb-6">Contrôle des équipements</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleLogin()}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="votre.email@caserne.fr"
              disabled={loading}
            />
          </div>
          {message && (
            <div
              className={`${
                isError
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              } border px-4 py-3 rounded-lg flex items-center gap-2`}
            >
              <AlertCircle size={20} />
              <span className="text-sm">{message}</span>
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400"
          >
            {loading ? 'Connexion...' : 'Entrer'}
          </button>
        </div>
      </div>
    </div>
  );
}