export interface SettingsProfile {
  name: string;
  email: string;
  phone: string;
}

export interface SettingsSecurity {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingsNotifications {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface SettingsPreferences {
  currency: string;
  language: string;
  theme: string;
}

export type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences';
