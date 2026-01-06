import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAppStore } from '@/store';
import {
  SettingsProfile,
  SettingsSecurity,
  SettingsNotifications,
  SettingsPreferences,
  SettingsTab,
} from '../types';

export function useSettings() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuthStore();
  const { setActiveModal } = useAppStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState<SettingsProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [security, setSecurity] = useState<SettingsSecurity>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState<SettingsNotifications>({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [preferences, setPreferences] = useState<SettingsPreferences>({
    currency: 'USD',
    language: 'en',
    theme: 'dark',
  });

  const handleProfileUpdate = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!profile.name.trim()) errors.name = 'Name is required';
    if (!profile.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Invalid email address';
    }

    if (Object.keys(errors).length > 0) {
      throw new Error(Object.values(errors)[0]);
    }

    updateProfile(profile);
  }, [profile, updateProfile]);

  const handlePasswordUpdate = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!security.currentPassword) errors.currentPassword = 'Current password is required';
    if (!security.newPassword) errors.newPassword = 'New password is required';
    else if (security.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (security.newPassword !== security.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      throw new Error(Object.values(errors)[0]);
    }

    // Update password logic here
    console.log('Password updated');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }, [security]);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
      setActiveModal(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [logout, setActiveModal, router]);

  return {
    // State
    activeTab,
    profile,
    security,
    notifications,
    preferences,
    showPasswords,
    isLoading,

    // Actions
    setActiveTab,
    setProfile,
    setSecurity,
    setNotifications,
    setPreferences,
    setShowPasswords,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleLogout,
  };
}
