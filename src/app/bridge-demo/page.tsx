'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BridgeConnectDemoContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState('banks');
  const [selectedBank, setSelectedBank] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isConnecting, setIsConnecting] = useState(false);

  const demosBanks = [
    { id: '574', name: 'Demo Bank', logo: '🏦' },
    { id: '1', name: 'BNP Paribas', logo: '🏛️' },
    { id: '2', name: 'Crédit Agricole', logo: '🌾' },
    { id: '3', name: 'Société Générale', logo: '🏧' },
  ];

  const handleBankSelect = (bankId: string, bankName: string) => {
    setSelectedBank(bankName);
    setStep('credentials');
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simuler une connexion
    setTimeout(() => {
      const isSuccess = credentials.username !== 'error';
      const resultParams = {
        success: isSuccess,
        user_uuid: searchParams.get('user') || 'demo_user_123',
        item_id: isSuccess ? `demo_item_${Date.now()}` : null,
        source: 'connect',
        session_id: `demo_session_${Date.now()}`,
        ...(isSuccess ? {} : { error: 'Identifiants invalides', step: 'credentials' })
      };

      // Construire l'URL de retour avec les paramètres
      const returnUrl = new URL('/bridge-return', window.location.origin);
      Object.entries(resultParams).forEach(([key, value]) => {
        if (value !== null) {
          returnUrl.searchParams.set(key, String(value));
        }
      });

      console.log('[Bridge Demo] Redirection vers:', returnUrl.toString());
      
      // Rediriger vers la page de retour
      window.location.href = returnUrl.toString();
    }, 2000);
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Connexion en cours...</h2>
          <p className="text-gray-600">Synchronisation avec {selectedBank}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bridge Connect */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-md mx-auto flex items-center">
          <h1 className="text-xl font-semibold">Bridge Connect</h1>
          <div className="ml-auto">
            <span className="bg-orange-500 text-xs px-2 py-1 rounded">DEMO</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {step === 'banks' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Choisissez votre banque</h2>
            <div className="space-y-3">
              {demosBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank.id, bank.name)}
                  className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <span className="text-2xl">{bank.logo}</span>
                  <span className="font-medium">{bank.name}</span>
                  {bank.id === '574' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-auto">
                      DEMO
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'credentials' && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setStep('banks')}
                className="text-blue-600 mr-4"
              >
                ← Retour
              </button>
              <h2 className="text-xl font-semibold">{selectedBank}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Identifiant
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({...prev, username: e.target.value}))}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Votre identifiant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Votre mot de passe"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-yellow-800 mb-2">Mode Démo</h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Testez différents scénarios :
                </p>
                <ul className="text-xs text-yellow-600 space-y-1">
                  <li>• <code>success</code> : Connexion réussie</li>
                  <li>• <code>error</code> : Simulation d'erreur</li>
                  <li>• Autres : Connexion normale</li>
                </ul>
              </div>

              <button
                onClick={handleConnect}
                disabled={!credentials.username || !credentials.password}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Connecter mon compte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BridgeConnectDemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <BridgeConnectDemoContent />
    </Suspense>
  );
}
