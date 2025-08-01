import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.BANKING_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

export function encryptSensitiveData(data: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('[BANKING_SECURITY] Encryption error:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
}

export function decryptSensitiveData(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[BANKING_SECURITY] Decryption error:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
}

export function validateBankingRequest(request: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validation des paramètres de base
  if (!request.userId) {
    errors.push('User ID is required');
  }
  
  // Validation de format pour les IDs
  if (request.accountId && !/^[a-zA-Z0-9_-]+$/.test(request.accountId)) {
    errors.push('Invalid account ID format');
  }
  
  // Validation des montants
  if (request.amount && (isNaN(request.amount) || request.amount < 0)) {
    errors.push('Invalid amount value');
  }
  
  // Validation de la devise
  if (request.currency && !/^[A-Z]{3}$/.test(request.currency)) {
    errors.push('Invalid currency format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeBankingData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const sanitized = { ...data };
  
  // Nettoyer les champs sensibles
  if (sanitized.iban) {
    sanitized.iban = sanitized.iban.replace(/[^A-Z0-9]/g, '').toUpperCase();
  }
  
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim().substring(0, 255);
  }
  
  if (sanitized.category) {
    sanitized.category = sanitized.category.trim().toLowerCase();
  }
  
  return sanitized;
}

export function logSecurityEvent(event: string, userId: string, details?: any): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    userId,
    details: details ? JSON.stringify(details) : undefined,
  };
  
  console.log('[BANKING_SECURITY]', JSON.stringify(logEntry));
  
  // En production, envoyer vers un service de logging sécurisé
  // comme AWS CloudWatch, Datadog, etc.
}

export function rateLimitCheck(userId: string, action: string): boolean {
  // Implémentation basique de rate limiting
  // En production, utiliser Redis ou une solution dédiée
  
  const rateLimits = {
    sync: { maxRequests: 5, windowMs: 60000 }, // 5 sync par minute
    fetch: { maxRequests: 100, windowMs: 60000 }, // 100 fetch par minute
  };
  
  const limit = rateLimits[action as keyof typeof rateLimits];
  if (!limit) {
    return true; // Pas de limite pour cette action
  }
  
  // Implémentation simple en mémoire (à remplacer par Redis en production)
  const key = `${userId}:${action}`;
  // Cette implémentation est simplifiée - en production, utiliser une vraie solution
  
  return true; // Temporairement autoriser toutes les requêtes
}

export function maskSensitiveFields(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const masked = { ...data };
  
  // Masquer les champs sensibles
  if (masked.iban) {
    masked.iban = masked.iban.substring(0, 4) + '****' + masked.iban.substring(masked.iban.length - 4);
  }
  
  if (masked.accountNumber) {
    masked.accountNumber = '****' + masked.accountNumber.substring(masked.accountNumber.length - 4);
  }
  
  // Garder seulement les 2 premières et 2 dernières lettres des noms
  if (masked.description && masked.description.length > 6) {
    const desc = masked.description;
    masked.description = desc.substring(0, 2) + '***' + desc.substring(desc.length - 2);
  }
  
  return masked;
}