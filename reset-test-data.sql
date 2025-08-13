-- Script pour nettoyer les données de test et tester le flux de première connexion
-- Exécuter avec: npx prisma db execute --file=reset-test-data.sql

-- Supprimer toutes les transactions bancaires de test
DELETE FROM "bank_transactions" WHERE "userId" IN (
  SELECT "id" FROM "users" WHERE "clerkId" = 'user_30SwglBEGH3n7gem5BJUqO1c5T4'
);

-- Supprimer tous les comptes bancaires de test
DELETE FROM "bank_accounts" WHERE "userId" IN (
  SELECT "id" FROM "users" WHERE "clerkId" = 'user_30SwglBEGH3n7gem5BJUqO1c5T4'
);

-- Vérifier les résultats
SELECT 
  'Accounts remaining' as table_name, 
  COUNT(*) as count 
FROM "bank_accounts" 
WHERE "userId" IN (SELECT "id" FROM "users" WHERE "clerkId" = 'user_30SwglBEGH3n7gem5BJUqO1c5T4')

UNION ALL

SELECT 
  'Transactions remaining' as table_name, 
  COUNT(*) as count 
FROM "bank_transactions" 
WHERE "userId" IN (SELECT "id" FROM "users" WHERE "clerkId" = 'user_30SwglBEGH3n7gem5BJUqO1c5T4');
