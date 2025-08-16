#!/usr/bin/env node

/**
 * Script de migration vers Bridge Connect Modal officielle
 * 
 * Ce script facilite la migration de l'ancien ConnectAccountModal
 * vers la nouvelle BridgeConnectModal basée sur l'iframe officielle Bridge.
 */

const fs = require('fs');
const path = require('path');

console.log('🌉 Migration vers Bridge Connect Modal Officielle');
console.log('================================================\n');

// Configuration
const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Fichiers à mettre à jour
const filesToUpdate = [
  {
    path: 'src/components/ProBankingDashboard.tsx',
    oldImport: "import ConnectAccountModal from './ConnectAccountModal';",
    newImport: "import BridgeConnectModal from './BridgeConnectModal';",
    oldComponent: '<ConnectAccountModal',
    newComponent: '<BridgeConnectModal',
    description: 'Dashboard bancaire principal'
  },
  {
    path: 'src/app/dashboard/page.tsx',
    oldImport: "import ConnectAccountModal from '@/components/ConnectAccountModal';",
    newImport: "import BridgeConnectModal from '@/components/BridgeConnectModal';",
    oldComponent: '<ConnectAccountModal',
    newComponent: '<BridgeConnectModal',
    description: 'Page dashboard (si utilisé)'
  }
];

// Vérifications préliminaires
function checkPrerequisites() {
  console.log('🔍 Vérification des prérequis...');
  
  // Vérifier que le nouveau composant existe
  const newModalPath = path.join(SRC_DIR, 'components', 'BridgeConnectModal.tsx');
  if (!fs.existsSync(newModalPath)) {
    console.error('❌ Le fichier BridgeConnectModal.tsx n\'existe pas');
    console.error('   Assurez-vous que le nouveau composant a été créé');
    process.exit(1);
  }
  
  // Vérifier les variables d'environnement Bridge
  if (!process.env.BRIDGE_CLIENT_ID || !process.env.BRIDGE_CLIENT_SECRET) {
    console.warn('⚠️  Variables Bridge non configurées:');
    console.warn('   BRIDGE_CLIENT_ID et BRIDGE_CLIENT_SECRET requis');
    console.warn('   Le mode démo sera utilisé par défaut\n');
  }
  
  console.log('✅ Prérequis validés\n');
}

// Sauvegarder l'ancien fichier
function backupFile(filePath) {
  const backupPath = `${filePath}.backup-${Date.now()}`;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Sauvegarde: ${path.basename(backupPath)}`);
    return backupPath;
  }
  return null;
}

// Mettre à jour un fichier
function updateFile(fileConfig) {
  const fullPath = path.join(PROJECT_ROOT, fileConfig.path);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  Fichier ignoré: ${fileConfig.path} (n'existe pas)`);
    return false;
  }
  
  console.log(`🔄 Mise à jour: ${fileConfig.description}`);
  console.log(`   Fichier: ${fileConfig.path}`);
  
  // Sauvegarder
  const backupPath = backupFile(fullPath);
  
  // Lire le contenu
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;
  
  // Remplacer l'import
  if (content.includes(fileConfig.oldImport)) {
    content = content.replace(fileConfig.oldImport, fileConfig.newImport);
    hasChanges = true;
    console.log('   ✅ Import mis à jour');
  }
  
  // Remplacer l'utilisation du composant
  if (content.includes(fileConfig.oldComponent)) {
    content = content.replace(
      new RegExp(fileConfig.oldComponent, 'g'), 
      fileConfig.newComponent
    );
    hasChanges = true;
    console.log('   ✅ Composant mis à jour');
  }
  
  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('   📝 Fichier sauvegardé');
  } else {
    console.log('   ℹ️  Aucune modification nécessaire');
    // Supprimer la sauvegarde si pas de changements
    if (backupPath && fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  }
  
  console.log('');
  return hasChanges;
}

// Vérifier la configuration Bridge
function checkBridgeConfig() {
  console.log('🔧 Vérification de la configuration Bridge...');
  
  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  Fichier .env.local non trouvé');
    console.warn('   Créez ce fichier avec vos credentials Bridge\n');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'BRIDGE_CLIENT_ID',
    'BRIDGE_CLIENT_SECRET',
    'BRIDGE_API_URL',
    'BRIDGE_ENVIRONMENT'
  ];
  
  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(varName)
  );
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Variables manquantes dans .env.local:');
    missingVars.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('');
  } else {
    console.log('✅ Configuration Bridge complète\n');
  }
}

// Générer un rapport de migration
function generateReport(changedFiles) {
  console.log('📊 Rapport de migration');
  console.log('======================');
  
  if (changedFiles.length === 0) {
    console.log('ℹ️  Aucun fichier modifié - migration déjà effectuée');
    return;
  }
  
  console.log(`✅ ${changedFiles.length} fichier(s) mis à jour:`);
  changedFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');
  
  console.log('📋 Prochaines étapes:');
  console.log('1. Testez l\'application en mode développement');
  console.log('2. Vérifiez que la modale Bridge s\'ouvre correctement');
  console.log('3. Testez la connexion avec Demo Bank (ID: 574)');
  console.log('4. Configurez les domaines autorisés dans Dashboard Bridge');
  console.log('5. Activez l\'iframe avec le support Bridge (si nécessaire)');
  console.log('');
  
  console.log('🔗 Ressources utiles:');
  console.log('- Documentation: docs/BRIDGE_CONNECT_MODAL_OFFICIAL.md');
  console.log('- Dashboard Bridge: https://dashboard.bridgeapi.io');
  console.log('- API Reference: https://docs.bridgeapi.io');
  console.log('');
}

// Fonction principale
function main() {
  try {
    checkPrerequisites();
    checkBridgeConfig();
    
    console.log('🚀 Début de la migration...\n');
    
    const changedFiles = [];
    
    // Mettre à jour chaque fichier
    filesToUpdate.forEach(fileConfig => {
      if (updateFile(fileConfig)) {
        changedFiles.push(fileConfig.path);
      }
    });
    
    generateReport(changedFiles);
    
    console.log('🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    process.exit(1);
  }
}

// Exécuter la migration
if (require.main === module) {
  main();
}

module.exports = {
  main,
  updateFile,
  checkPrerequisites
};
