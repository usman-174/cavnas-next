"use client";

import {
  User,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Globe,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '../hooks';
import { SettingsTab } from '../types';

export function SettingsPanel() {
  const {
    activeTab,
    profile,
    security,
    notifications,
    preferences,
    showPasswords,
    isLoading,
    setActiveTab,
    setProfile,
    setSecurity,
    setNotifications,
    setPreferences,
    setShowPasswords,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleLogout,
  } = useSettings();

  const settingsTabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'preferences' as SettingsTab, label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-lg glass-card border-white/10">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 rounded-xl glass-card border-white/10">
              <div className="size-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                <span className="text-2xl font-light text-white/90">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white/90">{profile.name}</div>
                <div className="text-xs text-white/40">{profile.email}</div>
              </div>
              <Badge variant="outline" className="glass border-white/10 text-white/60">
                Free Plan
              </Badge>
            </div>

            {/* Profile Form */}
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="John Doe"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Email Address</FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <FieldContent>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30"
                  />
                  <FieldDescription>Optional</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>

            <Button
              onClick={handleProfileUpdate}
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Update Profile
            </Button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-white/60" />
                <h3 className="text-sm font-medium text-white/90">Change Password</h3>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel>Current Password</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30 pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                      >
                        {showPasswords ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <FieldContent>
                    <Input
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                      className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30"
                    />
                    <FieldDescription>Minimum 8 characters</FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <FieldContent>
                    <Input
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      className="glass border-white/10 text-white bg-white/[0.02] placeholder:text-white/30"
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>

              <Button
                onClick={handlePasswordUpdate}
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Update Password
              </Button>
            </div>

            <Separator className="bg-white/10" />

            {/* Two-Factor Authentication */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg glass-card border-white/5">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Smartphone className="size-4 text-white/60" />
                  </div>
                  <div>
                    <div className="text-sm text-white/90">Two-Factor Authentication</div>
                    <div className="text-xs text-white/40">Add extra security to your account</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-white/30" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="size-4 text-white/60" />
              <h3 className="text-sm font-medium text-white/90">Notification Preferences</h3>
            </div>

            <div className="space-y-3">
              {[
                { id: 'email' as const, label: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
                { id: 'push' as const, label: 'Push Notifications', description: 'Receive push notifications', icon: Smartphone },
                { id: 'sms' as const, label: 'SMS Notifications', description: 'Receive text messages', icon: Mail },
                { id: 'marketing' as const, label: 'Marketing Emails', description: 'Receive promotional content', icon: Mail },
              ].map((setting) => {
                const Icon = setting.icon;
                return (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 rounded-lg glass-card border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Icon className="size-4 text-white/60" />
                      </div>
                      <div>
                        <div className="text-sm text-white/90">{setting.label}</div>
                        <div className="text-xs text-white/40">{setting.description}</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[setting.id]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [setting.id]: checked })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Currency */}
            <Field>
              <FieldLabel>Default Currency</FieldLabel>
              <FieldContent>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full h-7 rounded-md border border-white/10 bg-white/[0.02] px-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
                <FieldDescription>Set your preferred currency for transactions</FieldDescription>
              </FieldContent>
            </Field>

            {/* Language */}
            <Field>
              <FieldLabel>Language</FieldLabel>
              <FieldContent>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full h-7 rounded-md border border-white/10 bg-white/[0.02] px-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
                <FieldDescription>Choose your preferred language</FieldDescription>
              </FieldContent>
            </Field>

            {/* Theme */}
            <div className="space-y-3">
              <FieldLabel>Theme</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'light', label: 'Light', icon: Sun },
                ].map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, theme: theme.id })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
                        preferences.theme === theme.id
                          ? 'border-white/20 bg-white/10 text-white'
                          : 'border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-sm">{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Logout Button */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        disabled={isLoading}
        className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20"
      >
        <LogOut className="size-3.5 mr-2" />
        {isLoading ? 'Logging out...' : 'Log Out'}
      </Button>

      {/* App Version */}
      <div className="text-center text-xs text-white/30">
        Version 1.0.0 • Built with Next.js & shadcn/ui
      </div>
    </div>
  );
}
