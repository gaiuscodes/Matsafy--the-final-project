// config/constants.ts
// Application-wide constants

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100,
} as const;

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SACCO_ADMIN: 'SACCO_ADMIN',
} as const;

export const REPORT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  DISMISSED: 'DISMISSED',
} as const;

export const REPORT_CATEGORIES = {
  RECKLESS_DRIVING: 'RECKLESS_DRIVING',
  SPEEDING: 'SPEEDING',
  HARASSMENT: 'HARASSMENT',
  OVERLOADING: 'OVERLOADING',
  UNROADWORTHY: 'UNROADWORTHY',
  ROUTE_DEVIATION: 'ROUTE_DEVIATION',
  FARE_DISPUTE: 'FARE_DISPUTE',
  DRUNK_DRIVING: 'DRUNK_DRIVING',
  OTHER: 'OTHER',
} as const;

export const SESSION_CONFIG = {
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
} as const;

export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 10,
} as const;

