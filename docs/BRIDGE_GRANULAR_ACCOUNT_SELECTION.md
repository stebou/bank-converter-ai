# Bridge API Granular Account Selection Documentation

## Overview

This documentation provides comprehensive guidance for implementing granular account selection capabilities using the Bridge API v2025-01-15. Bridge API offers sophisticated account management features that allow users to selectively connect and manage individual banking accounts with fine-grained data access control.

## Table of Contents

1. [Account Types and Selection](#account-types-and-selection)
2. [Bridge Connect Configuration](#bridge-connect-configuration)
3. [Data Access Control](#data-access-control)
4. [API Implementation](#api-implementation)
5. [Webhook Events](#webhook-events)
6. [Migration from v2021 to v2025](#migration-from-v2021-to-v2025)
7. [Best Practices](#best-practices)
8. [Technical Specifications](#technical-specifications)

## Account Types and Selection

### Available Account Modes

Bridge API v2025-01-15 provides two distinct account selection modes:

#### 1. Payment Accounts Mode (Default)
- **Default behavior**: If no `account_types` parameter is specified
- **Focus**: Payment-related accounts (checking accounts, cards)
- **User Experience**: Seamless redirected experience with quick authentication
- **Benefits**: 
  - Often uses biometrics for authentication
  - Maximizes user conversion rates
  - Simplified connection lifecycle
- **Use Case**: Applications primarily focused on payment processing

#### 2. All Accounts Mode
- **Activation**: Set `account_types` parameter to `all`
- **Scope**: Full range of user accounts including:
  - Checking accounts
  - Cards
  - Savings accounts
  - Loans
  - Investment accounts (stocks)
  - Life insurance
  - PEA accounts
- **User Experience**: Multi-step process with more complex connection lifecycle
- **Note**: More complex implementation, recommended only for specific use cases

### Account Type Categories

The v2025 API includes simplified account types:
- `checking`: Standard checking accounts
- `card`: Credit and debit cards
- `savings`: Savings accounts
- `brokerage`: Investment/brokerage accounts
- `loan`: Loan accounts
- `life_insurance`: Life insurance accounts
- `PEA`: Plan d'Épargne en Actions
- `unknown`: Unclassified account types

## Bridge Connect Configuration

### Connect Session Creation

When creating a Bridge Connect session, use the following endpoint:

```
POST https://api.bridgeapi.io/v3/aggregation/connect-sessions
```

### Key Parameters

#### account_types Parameter
```json
{
  "account_types": "all"  // or omit for default "payment" mode
}
```

### User Account Exclusion

**Critical Feature**: Users can exclude specific accounts during the Connect flow that they do not wish to share with your application.

**Impact**: When an account is excluded:
- Account's `data_access` field is set to `disabled`
- No access to transactions, balance, IBAN, or other account details
- Account still appears in account lists but with restricted access

## Data Access Control

### data_access Field

The `data_access` field is the primary mechanism for granular account control:

#### Possible Values:
- `enabled`: Full access to account data
- `disabled`: No access to account data

#### When data_access is "disabled":
- Associated IBAN is not accessible
- Balances are not accessible
- Loan details are not accessible
- Transactions are not accessible
- Stock information is not accessible

### Implementation Pattern

Always filter accounts based on data access status:

```javascript
// Retrieve accounts
const accounts = await fetch('/v3/aggregation/accounts');

// Filter only enabled accounts
const enabledAccounts = accounts.filter(account => 
  account.data_access === 'enabled'
);
```

### Account Status Monitoring

Monitor the `last_refresh_status` field to validate account update success:
- Check if `account.updated_at >= item.last_try_refresh`
- Successful status indicates the account data is current

## API Implementation

### Core Endpoints

#### 1. Retrieve Accounts
```
GET /v3/aggregation/accounts
```

**Filter Implementation**:
```javascript
// Exclude accounts where data_access is "disabled"
const activeAccounts = accounts.filter(account => 
  account.data_access !== 'disabled'
);
```

#### 2. Retrieve Transactions
```
GET /v3/aggregation/transactions
```

**Note**: Only works for accounts with `data_access: enabled`

#### 3. User Management
```
POST /v3/aggregation/users
POST /v3/aggregation/authorization/token
```

### Account Resource Structure

Key fields for granular control:
```json
{
  "id": "account_id",
  "data_access": "enabled|disabled",
  "last_refresh_status": "status_info",
  "type": "checking|card|savings|etc",
  "pro": "boolean", // Indicates business account
  "balance": "accessible_only_if_enabled",
  "iban": "accessible_only_if_enabled"
}
```

## Webhook Events

### Account-Related Webhooks

#### 1. account.created
Triggered when a new account is detected during synchronization.

```json
{
  "type": "account.created",
  "content": {
    "account_id": 12345,
    "item_id": 6789,
    "user_uuid": "user-uuid-here"
  }
}
```

#### 2. account.updated
Triggered when account information changes, including data access modifications.

```json
{
  "type": "account.updated",
  "content": {
    "account_id": 47050682,
    "data_access": "disabled",
    "item_id": 9947120,
    "user_uuid": "user-uuid-here"
  }
}
```

**Update Scenarios**:
- New transactions added
- Transactions deleted/updated
- Balance changes
- **Data access status modifications**

#### 3. account.deleted
Triggered when a bank account is no longer being updated.

```json
{
  "type": "account.deleted",
  "content": {
    "account_id": 12345,
    "item_id": 6789,
    "user_uuid": "user-uuid-here"
  }
}
```

### Webhook Implementation for Account Management

```javascript
// Handle account data access changes
function handleAccountUpdate(webhook) {
  if (webhook.type === 'account.updated') {
    const { account_id, data_access } = webhook.content;
    
    if (data_access === 'disabled') {
      // Remove account from active data processing
      removeAccountFromProcessing(account_id);
    } else if (data_access === 'enabled') {
      // Re-enable account for data processing
      enableAccountProcessing(account_id);
    }
  }
}
```

## Migration from v2021 to v2025

### Key Changes

#### 1. New data_access Field
- **v2021**: No granular data access control
- **v2025**: `data_access` field indicates enabled/disabled status

#### 2. Account Selection Enhancement
- **v2021**: Limited account filtering capabilities
- **v2025**: Users can disable accounts during Connect sessions

#### 3. Webhook Payload Changes
- **v2025**: Disabled accounts exclude specific fields from webhooks
- Example: Balance and transaction counts not included for disabled accounts

#### 4. Null Field Handling
- **v2025**: Null fields are no longer exposed
- **v2021**: Null fields still present in responses

### Migration Code Example

```javascript
// v2021 approach
const accounts = await getAccounts();
// All accounts returned regardless of user preferences

// v2025 approach
const accounts = await getAccounts();
const enabledAccounts = accounts.filter(account => 
  account.data_access === 'enabled'
);
```

## Best Practices

### 1. Account Filtering Strategy
Always implement filtering based on `data_access` status:

```javascript
function getActiveAccounts(accounts) {
  return accounts.filter(account => {
    return account.data_access === 'enabled' && 
           account.last_refresh_status === 'successful';
  });
}
```

### 2. Data Storage Recommendations
- Store all account information including disabled accounts
- Respect data access restrictions in application logic
- Use webhooks to update account status in real-time

### 3. User Experience Considerations
- Inform users about account selection capabilities
- Provide clear UI for managing connected accounts
- Handle disabled accounts gracefully in the application

### 4. Security Implementation
- Encrypt all banking data retrieved via the API
- Whitelist IP addresses for secure API interactions
- Authenticate users before making API calls
- Delete user data when subscriptions are canceled

### 5. Data Retrieval Optimization
- Use incremental fetching with `since` parameter
- Store `updated_at` timestamps for subsequent requests
- Implement proper pagination for large datasets

## Technical Specifications

### Connect Session Parameters

```json
{
  "account_types": "payment|all",
  "redirect_url": "your_redirect_url",
  "webhook_url": "your_webhook_url",
  "client_reference": "your_reference"
}
```

### Account Filtering Logic

```javascript
class BridgeAccountManager {
  async getEnabledAccounts(userId) {
    const allAccounts = await this.bridgeApi.getAccounts(userId);
    
    return allAccounts.filter(account => {
      // Primary filter: data access enabled
      if (account.data_access !== 'enabled') {
        return false;
      }
      
      // Secondary filter: successful refresh status
      if (account.last_refresh_status !== 'successful') {
        console.warn(`Account ${account.id} has refresh issues`);
      }
      
      return true;
    });
  }
  
  async handleAccountUpdate(webhook) {
    const { account_id, data_access, user_uuid } = webhook.content;
    
    if (data_access === 'disabled') {
      await this.disableAccountInApp(account_id, user_uuid);
    } else if (data_access === 'enabled') {
      await this.enableAccountInApp(account_id, user_uuid);
    }
  }
}
```

### Incremental Data Fetching

```javascript
async function fetchTransactionsIncremental(lastFetchTime) {
  const url = `https://api.bridgeapi.io/v3/aggregation/transactions?since=${lastFetchTime}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
}
```

### Access Token Management

- **Validity**: Access tokens valid for 2 hours
- **Refresh**: Implement token refresh logic
- **Storage**: Securely store tokens with encryption

## Error Handling

### Common Scenarios

1. **Disabled Account Access**:
   - Error: 403 Forbidden when accessing disabled account data
   - Solution: Check `data_access` field before API calls

2. **Refresh Failures**:
   - Monitor `last_refresh_status` field
   - Implement retry logic for failed refreshes

3. **Account Deletion**:
   - Handle account.deleted webhooks
   - Clean up local data for deleted accounts

## Conclusion

Bridge API v2025-01-15 provides comprehensive granular account selection capabilities through:

1. **Flexible Account Types**: Payment vs. All accounts modes
2. **User-Controlled Access**: Users can disable specific accounts
3. **Real-time Updates**: Webhook events for account status changes
4. **Secure Implementation**: Built-in security features and recommendations

The `data_access` field is the cornerstone of granular account management, enabling applications to respect user preferences while maintaining secure and efficient data access patterns.

For full implementation details, refer to the official Bridge API documentation at https://docs.bridgeapi.io/

---

*This documentation was generated based on Bridge API v2025-01-15 specifications and implementation guidelines.*