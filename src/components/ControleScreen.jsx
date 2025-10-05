// src/components/ControleScreen.jsx
import React, { useState, useEffect } from 'react';
import { Check, X, Download } from 'lucide-react';
import { DB } from '../services/db';

export default function ControleScreen({ camion, user, onBack }) {
  const [equipements, setEquipements] = useState([]);
  const [controle, setControle] = useState({});
  const [showRapport, setShowRapport] = useState(false);
  const [rapportData, setRapportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEquipements() {
      const equips = await DB.getEquipementsByCamion(camion.id);
      setEquipements(equips);
      
      const init = {};
      equips.forEach((e) => {
        init[e.id] = { status: null, commentaire: '' };
      });
      setControle(init);
      setLoading(false);
    }
    loadEquipements();
  }, [camion.id]);

  const handleStatus = (id, status) => {
    setControle((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status,
        commentaire: status === 'absent' ? prev[id].commentaire : '',
      },
    }));
  };

  const handleComment = (equipId, commentaire) => {
    setControle((prev) => ({
      ...prev,
      [equipId]: { ...prev[equipId], commentaire },
    }));
  };

  const verified = Object.values(controle).filter((c) => c.status !== null).length;
  const canValidate = equipements.every((e) => {
    const c = controle[e.id];
    return c && c.status !== null && (c.status !== 'absent' || c.commentaire.trim());
  });

  const handleValidate = async () => {
    const presents = Object.values(controle).filter((c) => c.status === 'present').length;
    const absents = Object.values(controle).filter((c) => c.status === 'absent').length;
    const taux = ((presents / equipements.length) * 100).toFixed(1);
    
    const config = await DB.getConfig();

    const equipementsDetailles = equipements.map((e) => ({
      nom: e.nom,
      status: controle[e.id].status,
      commentaire: controle[e.id].commentaire,
    }));

    setRapportData({
      camion: `${camion.marque} ${camion.type}`,
      immatriculation: camion.immatriculation,
      presents,
      absents,
      total: equipements.length,
      taux,
      emailChef: config.emailChefCorps,
      date: new Date().toLocaleString('fr-FR'),
      controlePar: user?.email || "Utilisateur",
      equipements: equipementsDetailles,
    });
    setShowRapport(true);
  };

  const generatePDF = () => {
    const pdfContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #1e40af; text-align: center; margin-bottom: 30px; }
    .header { background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .header-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .label { font-weight: bold; color: #4b5563; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th { background: #1e40af; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .present { color: #059669; font-weight: bold; }
    .absent { color: #dc2626; font-weight: bold; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .footer { text-align: center; color: #6b7280; margin-top: 40px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>🚒 RAPPORT DE CONTRÔLE D'INVENTAIRE</h1>
  <div class="header">
    <div class="header-row">
      <div><span class="label">Date et heure:</span> ${rapportData.date}</div>
    </div>
    <div class="header-row">
      <div><span class="label">Camion:</span> ${rapportData.camion}</div>
      <div><span class="label">Immatriculation:</span> ${rapportData.immatriculation}</div>
    </div>
    <div class="header-row">
      <div><span class="label">Contrôlé par:</span> ${rapportData.controlePar}</div>
    </div>
  </div>
  <h2>Détail des équipements</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 50%">Équipement</th>
        <th style="width: 15%">Statut</th>
        <th style="width: 35%">Commentaire</th>
      </tr>
    </thead>
    <tbody>
      ${rapportData.equipements.map(e => `
        <tr>
          <td>${e.nom}</td>
          <td class="${e.status}">${e.status === 'present' ? '✓ Présent' : '✗ Absent'}</td>
          <td>${e.commentaire || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="summary">
    <h3 style="margin-top: 0;">Résumé</h3>
    <div class="summary-row">
      <span class="label">Nombre total d'équipements:</span>
      <span>${rapportData.total}</span>
    </div>
    <div class="summary-row">
      <span class="label">Équipements présents:</span>
      <span style="color: #059669; font-weight: bold;">${rapportData.presents}</span>
    </div>
    <div class="summary-row">
      <span class="label">Équipements défaillants ou absents:</span>
      <span style="color: #dc2626; font-weight: bold;">${rapportData.absents}</span>
    </div>
    <div class="summary-row" style="border-top: 2px solid #1e40af; padding-top: 10px; margin-top: 10px;">
      <span class="label" style="font-size: 18px;">Taux de conformité:</span>
      <span style="color: #1e40af; font-weight: bold; font-size: 18px;">${rapportData.taux}%</span>
    </div>
  </div>
  <div class="footer">
    <p>Rapport généré automatiquement le ${rapportData.date}</p>
    <p>Application Inventaire Pompiers - Caserne</p>
  </div>
</body>
</html>`;

    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapport_${rapportData.immatriculation}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCloseRapport = () => {
    setShowRapport(false);
    setTimeout(() => onBack(), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des équipements...</p>
        </div>
      </div>
    );
  }

  if (showRapport && rapportData) {
    return (
      <div className="min-h-screen bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">✅ Rapport Généré</h2>
            <p className="text-gray-600">Le contrôle a été validé avec succès</p>
          </div>

          <div className="border-2 border-blue-900 rounded-lg p-3 sm:p-6 mb-6 bg-gray-50">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-4 text-center">
              Aperçu du Rapport
            </h3>

            <div className="bg-white rounded p-3 sm:p-4 mb-4 space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600 font-medium">Date et heure:</span>
                <span className="font-medium break-all">{rapportData.date}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600 font-medium">Camion:</span>
                <span className="font-bold break-words">{rapportData.camion}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600 font-medium">Immatriculation:</span>
                <span className="font-bold">{rapportData.immatriculation}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600 font-medium">Contrôlé par:</span>
                <span className="font-medium break-all">{rapportData.controlePar}</span>
              </div>
            </div>

            <div className="bg-white rounded p-3 sm:p-4 mb-4">
              <h4 className="font-bold mb-3 text-xs sm:text-sm">Résumé des équipements</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold">{rapportData.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Présents:</span>
                  <span className="font-bold text-green-600">{rapportData.presents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Défaillants/Absents:</span>
                  <span className="font-bold text-red-600">{rapportData.absents}</span>
                </div>
                <div className="flex justify-between border-t-2 border-blue-900 pt-2 mt-2">
                  <span className="text-gray-700 font-bold text-sm sm:text-base">
                    Taux de conformité:
                  </span>
                  <span className="font-bold text-blue-900 text-base sm:text-lg">
                    {rapportData.taux}%
                  </span>
                </div>
              </div>
            </div>

            {rapportData.absents > 0 && (
              <div className="bg-white rounded p-3 sm:p-4">
                <h4 className="font-bold mb-3 text-xs sm:text-sm text-red-700">
                  Équipements défaillants ou absents
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {rapportData.equipements
                    .filter((e) => e.status === 'absent')
                    .map((e, i) => (
                      <li key={i} className="border-l-2 border-red-500 pl-2 sm:pl-3">
                        <div className="font-medium break-words">{e.nom}</div>
                        <div className="text-gray-600 text-xs italic break-words">
                          {e.commentaire}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-900 p-3 mb-6">
            <p className="text-xs sm:text-sm text-blue-900">
              Le rapport sera envoyé à :{' '}
              <strong className="break-all block sm:inline mt-1 sm:mt-0">
                {rapportData.emailChef}
              </strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generatePDF}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Télécharger le Rapport
            </button>
            <button
              onClick={handleCloseRapport}
              className="flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (equipements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-900 text-white p-4">
          <h1 className="text-2xl font-bold max-w-4xl mx-auto">
            Contrôle - {camion.marque}
          </h1>
        </div>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Aucun équipement configuré.</p>
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Contrôle - {camion.marque} {camion.type}
          </h1>
          <p className="text-blue-200">Immatriculation: {camion.immatriculation}</p>
          <p className="text-blue-200 text-sm">Contrôlé par: {user?.email 
|| "Utilisateur"}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Progression: {verified} / {equipements.length}
            </span>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all"
                style={{ width: `${(verified / equipements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          {equipements.map((equip) => {
            const c = controle[equip.id];
            return (
              <div key={equip.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-3">{equip.nom}</h3>
                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => handleStatus(equip.id, 'present')}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium flex items-center justify-center gap-2 ${
                      c.status === 'present'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    <Check size={20} />
                    Présent
                  </button>
                  <button
                    onClick={() => handleStatus(equip.id, 'absent')}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium flex items-center justify-center gap-2 text-sm sm:text-base ${
                      c.status === 'absent'
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-gray-300 hover:border-red-500'
                    }`}
                  >
                    <X size={20} />
                    Défaillant ou absent
                  </button>
                </div>
                {c.status === 'absent' && (
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Raison de la défaillance ou absence (obligatoire)
                    </label>
                    <textarea
                      value={c.commentaire}
                      onChange={(e) => handleComment(equip.id, e.target.value)}
                      placeholder="Ex: matériel cassé, en commande, prêté à une autre caserne..."
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      rows="2"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={handleValidate}
            disabled={!canValidate}
            className={`flex-1 py-3 rounded-lg font-medium ${
              canValidate
                ? 'bg-blue-900 text-white hover:bg-blue-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canValidate ? 'Valider le Contrôle' : 'Complétez TOUS les équipements'}
          </button>
        </div>
      </div>
    </div>
  );
}
