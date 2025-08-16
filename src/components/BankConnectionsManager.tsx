'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useBankConnections } from '@/hooks/useBankConnections';
import {
    AlertCircle,
    Building2,
    CheckCircle,
    CreditCard,
    RefreshCw,
    Trash2,
    Plus,
} from 'lucide-react';
import { useState } from 'react';
import BridgeConnectOfficial from './BridgeConnectOfficial';

export function BankConnectionsManager() {
  const {
    connections,
    isLoading,
    error,
    refreshConnections,
    disconnectConnection,
  } = useBankConnections();
  const [disconnectingItemId, setDisconnectingItemId] = useState<string | null>(
    null
  );

  const handleDisconnect = async (bridgeItemId: string, bankName: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir déconnecter ${bankName} ? Tous les comptes associés seront déconnectés.`
      )
    ) {
      return;
    }

    setDisconnectingItemId(bridgeItemId);

    const success = await disconnectConnection(bridgeItemId);

    if (success) {
      // Optionnel : afficher une notification de succès
      console.log(`Connexion ${bankName} déconnectée avec succès`);
    }

    setDisconnectingItemId(null);
  };

  const handleConnectionSuccess = async (data: any) => {
    console.log('✅ Nouvelle connexion établie:', data);
    // Actualiser la liste des connexions après une nouvelle connexion
    await refreshConnections();
  };

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
    }).format(balance);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: 'Compte Courant',
      savings: 'Épargne',
      investment: 'Investissement',
      current: 'Compte Courant',
      deposit: 'Dépôt',
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Connexions Bancaires
          </CardTitle>
          <CardDescription>
            Gérez vos connexions bancaires individuellement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="text-muted-foreground h-6 w-6 animate-spin" />
            <span className="text-muted-foreground ml-2">
              Chargement des connexions...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Connexions Bancaires
            </CardTitle>
            <CardDescription>
              Gérez vos connexions bancaires individuellement
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <BridgeConnectOfficial
              onSuccess={handleConnectionSuccess}
              onError={(error) => console.error('Erreur connexion:', error)}
              className="px-3 py-1.5 text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un compte
            </BridgeConnectOfficial>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshConnections}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {connections.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="mb-2">Aucune connexion bancaire trouvée</p>
            <p className="text-sm mb-4">Connectez votre banque pour commencer</p>
            <BridgeConnectOfficial
              onSuccess={handleConnectionSuccess}
              onError={(error) => console.error('Erreur connexion:', error)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Connecter ma première banque
            </BridgeConnectOfficial>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map(connection => {
              const totalBalance = connection.accounts.reduce(
                (sum, account) => sum + account.balance,
                0
              );
              const isDisconnecting =
                disconnectingItemId === connection.bridgeItemId;

              return (
                <Card
                  key={connection.bridgeItemId}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold">
                            {connection.bankName}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Connecté le {formatDate(connection.connectedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-green-600 text-green-600"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Connecté
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDisconnect(
                              connection.bridgeItemId,
                              connection.bankName
                            )
                          }
                          disabled={isDisconnecting}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          {isDisconnecting ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Solde total</span>
                        <span className="text-lg font-semibold text-green-600">
                          {formatBalance(
                            totalBalance,
                            connection.accounts[0]?.currency || 'EUR'
                          )}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-muted-foreground text-sm font-medium">
                          Comptes ({connection.accounts.length})
                        </h4>
                        {connection.accounts.map(account => (
                          <div
                            key={account.id}
                            className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="text-muted-foreground h-4 w-4" />
                              <div>
                                <p className="font-medium">{account.name}</p>
                                <p className="text-muted-foreground text-xs">
                                  {getAccountTypeLabel(account.type)}
                                  {account.iban &&
                                    ` • ${account.iban.replace(/(.{4})/g, '$1 ').trim()}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatBalance(
                                  account.balance,
                                  account.currency
                                )}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                ID: {account.bridgeAccountId.slice(-8)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BankConnectionsManager;
