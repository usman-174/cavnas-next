import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAppStore } from '@/store';
import { TierType } from '@/types';
import {
  validateEmail,
  validateName,
  validatePassword,
  getAuthErrorMessage,
  AUTH_ERROR_CODES,
  type AuthErrorCode,
} from '@/lib/validation/auth';
import {
  SettingsProfile,
  SettingsSecurity,
  SettingsNotifications,
  SettingsPreferences,
  SettingsTab,
} from '../types';

// API helper for settings requests
async function settingsApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; code?: AuthErrorCode }> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export function useSettings() {
  const router = useRouter();
  const { user, logout, updateProfile: updateAuthStoreProfile } = useAuthStore();
  const { setActiveModal } = useAppStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Initialize profile state with real user data from auth store
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

  // Update profile state when user data changes from auth store
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const getTierLabel = (tier: TierType) => {
    switch (tier) {
      case TierType.EARLY_BIRD:
        return 'Early Bird';
      case TierType.REGULAR:
        return 'Regular';
      default:
        return 'Standard';
    }
  };

  const clearErrors = useCallback(() => {
    setFieldErrors({});
    setSuccessMessage(null);
  }, []);

  const handleProfileUpdate = useCallback(async () => {
    clearErrors();
    const errors: Record<string, string> = {};

    // Validate name
    const nameResult = validateName(profile.name);
    if (!nameResult.valid) {
      errors.name = nameResult.error || 'Invalid name';
    }

    // Validate email
    const emailResult = validateEmail(profile.email);
    if (!emailResult.valid) {
      errors.email = emailResult.error || 'Invalid email';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await settingsApiCall<{ name: string; email: string }>(
        '/api/user/profile',
        {
          method: 'PATCH',
          body: JSON.stringify({
            name: profile.name.trim(),
            email: profile.email.trim(),
          }),
        }
      );

      if (response.success && response.data) {
        // Update auth store with new profile data
        updateAuthStoreProfile(response.data);
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setFieldErrors({
          form: getAuthErrorMessage(response.error, response.code),
        });
      }
    } catch (error) {
      setFieldErrors({
        form: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [profile, updateAuthStoreProfile, clearErrors]);

  const handlePasswordUpdate = useCallback(async () => {
    clearErrors();
    const errors: Record<string, string> = {};

    // Validate current password
    if (!security.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    // Validate new password
    const passwordResult = validatePassword(security.newPassword);
    if (!passwordResult.valid) {
      errors.newPassword = passwordResult.error || 'Invalid password';
    }

    // Validate confirm password
    if (security.newPassword !== security.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await settingsApiCall<{ success: boolean }>(
        '/api/user/password',
        {
          method: 'PATCH',
          body: JSON.stringify({
            currentPassword: security.currentPassword,
            newPassword: security.newPassword,
          }),
        }
      );

      if (response.success) {
        setSuccessMessage('Password updated successfully');
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // Map password-specific error codes
        if (response.code === AUTH_ERROR_CODES.CREDENTIALS_INVALID) {
          errors.currentPassword = 'Current password is incorrect';
        } else {
          errors.form = getAuthErrorMessage(response.error, response.code);
        }
        setFieldErrors(errors);
      }
    } catch (error) {
      setFieldErrors({
        form: 'Failed to update password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [security, clearErrors]);

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
    successMessage,
    fieldErrors,
    user, // Expose user for displaying tier info

    // Helpers
    getTierLabel,

    // Actions
    setActiveTab,
    setProfile,
    setSecurity,
    setNotifications,
    setPreferences,
    setShowPasswords,
    clearErrors,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleLogout,
  };
}
