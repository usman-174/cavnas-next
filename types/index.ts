// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

// User Role & Status Enums
export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum TierType {
  EARLY_BIRD = 'EARLY_BIRD',
  REGULAR = 'REGULAR',
}

// Extended User Interface with CAB2Wealth specific fields
export interface CabUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  tier: TierType;
  reservationNumber: number;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// Auth types
export interface AuthState {
  user: CabUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Registration with tier selection for CAB2Wealth
export interface CabRegisterCredentials {
  email: string;
  password: string;
  name: string;
  tier: TierType;
}

// Tier Capacity Info for landing page display
export interface TierCapacityInfo {
  tier: TierType;
  capacity: number;
  currentCount: number;
  remaining: number;
  progressPercent: number;
}

// API Response wrapper
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Financial types
export interface Balance {
  total: number;
  change: number;
  changePercent: number;
  period: string;
  [currency: string]: {
    available: number;
    total: number;
    change: number;
  } | number | string | undefined;
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
}

export interface Holding {
  id: string;
  name: string;
  symbol: string;
  value: number;
  quantity: number;
  currentPrice: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface Card {
  id: string;
  name: string;
  number: string;
  last4: string;
  expiry: string;
  brand: 'visa' | 'mastercard' | 'amex';
  balance: number;
}

// Deposit types
export interface Deposit {
  id: string;
  name: string;
  type: string;
  value: number;
  change: number;
  changePercent: number;
  positive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Modal types
export type ModalType = 'send' | 'receive' | 'cards' | 'holdings' | 'settings' | null;
