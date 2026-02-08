"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { CabLogoFull } from '@/components/shared/logo/CabLogo';
import { TierCapacityInfo, TierType } from '@/types';
import {
  validateEmail,
  validatePassword,
  validateName,
  getAuthErrorMessage,
  type AuthErrorCode,
} from '@/lib/validation/auth';

interface AuthFormProps {
  isRegister?: boolean;
  tierOptions?: TierCapacityInfo[];
}

const DEFAULT_TIER_OPTIONS: TierCapacityInfo[] = [
  {
    tier: TierType.EARLY_BIRD,
    capacity: 1000,
    currentCount: 0,
    remaining: 1000,
    progressPercent: 0,
  },
  {
    tier: TierType.REGULAR,
    capacity: 10000,
    currentCount: 0,
    remaining: 10000,
    progressPercent: 0,
  },
];

function getTierLabel(tier: TierType): string {
  switch (tier) {
    case TierType.EARLY_BIRD:
      return 'Early Bird';
    case TierType.REGULAR:
      return 'Regular';
    default:
      return 'Tier';
  }
}

function getTierDescription(tier: TierType, capacity?: number): string {
  const base = tier === TierType.EARLY_BIRD
    ? '$200 service fee'
    : tier === TierType.REGULAR
      ? '$2,500 service fee'
      : 'Limited access';

  if (!capacity || capacity <= 0) {
    return base;
  }

  return `${base} - ${capacity.toLocaleString()} capacity`;
}

export function AuthForm({ isRegister: initialIsRegister = false, tierOptions }: AuthFormProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierType>(TierType.EARLY_BIRD);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  // Strength calculation helper
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 4) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const getStrengthLabel = (score: number) => {
    if (score === 0) return '';
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  // Field-specific errors for inline validation
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const { login, register, isLoading, error, clearError, isAdmin } = useAuthStore();

  const resolvedTierOptions = useMemo(() => {
    const source = tierOptions && tierOptions.length > 0 ? tierOptions : DEFAULT_TIER_OPTIONS;

    return source.map((option) => ({
      type: option.tier,
      name: getTierLabel(option.tier),
      description: getTierDescription(option.tier, option.capacity),
      capacity: option.capacity,
    }));
  }, [tierOptions]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!resolvedTierOptions.length) return;
    if (!resolvedTierOptions.some((tier) => tier.type === selectedTier)) {
      setSelectedTier(resolvedTierOptions[0].type);
    }
  }, [resolvedTierOptions, selectedTier]);

  useEffect(() => {
    clearError();
    setFieldErrors({});
  }, [isRegister, clearError]);

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) {
      errors.email = emailResult.error || 'Invalid email';
    }

    // Password validation
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.valid) {
      errors.password = passwordResult.error || 'Invalid password';
    }

    // Name validation (only for registration)
    if (isRegister) {
      const nameResult = validateName(formData.name);
      if (!nameResult.valid) {
        errors.name = nameResult.error || 'Invalid name';
      }

      // Confirm Password validation
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    let success = false;

    if (isRegister) {
      success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        tier: selectedTier,
      });
    } else {
      success = await login({
        email: formData.email,
        password: formData.password,
      });
    }

    if (success) {
      // Clear form
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      // Redirect admins to /admin, clients to /dashboard
      startTransition(() => {
        router.push(isAdmin() ? '/admin' : '/dashboard');
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-y-auto font-sans selection:bg-white/20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-linear-to-br from-slate-900 via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Logo */}
        <div
          className={`mb-12 transition-all duration-1000 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <CabLogoFull />
        </div>

        {/* Title */}
        <div
          className={`mb-8 text-center transition-all duration-1500 delay-200 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
        >
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-white/40">
            {isRegister ? 'Join the exclusive wealth management platform' : 'Sign in to your account'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-200">{getAuthErrorMessage(error)}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`w-full transition-all duration-1500 delay-400 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}
        >
          <FieldGroup>
            {isRegister && (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Alexander Sterling"
                    className="glass border-white/10 text-white bg-white/2 h-11 px-4 placeholder:text-white/30"
                    autoComplete="name"
                  />
                </FieldContent>
                {fieldErrors.name && <p className="text-xs text-red-400 mt-1.5">{fieldErrors.name}</p>}
              </Field>
            )}

            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="glass border-white/10 text-white bg-white/2 h-11 px-4 placeholder:text-white/30"
                  autoComplete={isRegister ? 'email' : 'username'}
                />
              </FieldContent>
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1.5">{fieldErrors.email}</p>}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="glass border-white/10 text-white bg-white/2 h-11 px-4 pr-10 placeholder:text-white/30"
                    minLength={8}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 hover:text-white h-7 w-7"
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {isRegister && formData.password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1 h-1">
                      {[...Array(4)].map((_, i) => {
                        const strength = calculateStrength(formData.password);
                        let color = 'bg-white/10';
                        if (strength > i) {
                          if (strength <= 1) color = 'bg-red-500';
                          else if (strength === 2) color = 'bg-orange-500';
                          else if (strength === 3) color = 'bg-yellow-500';
                          else color = 'bg-emerald-500';
                        }
                        return (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${color}`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-right text-white/50">
                      {getStrengthLabel(calculateStrength(formData.password))}
                    </p>
                  </div>
                )}
              </FieldContent>
              {fieldErrors.password && <p className="text-xs text-red-400 mt-1.5">{fieldErrors.password}</p>}
            </Field>

            {/* Confirm Password - Only shown during registration */}
            {isRegister && (
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="glass border-white/10 text-white bg-white/2 h-11 px-4 pr-10 placeholder:text-white/30"
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 hover:text-white h-7 w-7"
                    >
                      {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </Button>
                  </div>
                </FieldContent>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1.5">{fieldErrors.confirmPassword}</p>
                )}
              </Field>
            )}

            {/* Tier Selection - Only shown during registration */}
            {isRegister && (
              <Field>
                <FieldLabel>Select Your Tier</FieldLabel>
                <FieldContent>
                  <div className="grid grid-cols-2 gap-3">
                    {resolvedTierOptions.map((tier) => (
                      <button
                        key={tier.type}
                        type="button"
                        onClick={() => setSelectedTier(tier.type)}
                        className={`relative p-4 rounded-xl border transition-all duration-300 text-left ${selectedTier === tier.type
                          ? 'bg-white/10 border-white/30 shadow-lg shadow-white/5'
                          : 'bg-white/2 border-white/10 hover:bg-white/5 hover:border-white/20'
                          }`}
                      >
                        {selectedTier === tier.type && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                            <Check size={12} className="text-emerald-400" />
                          </div>
                        )}
                        <div className="text-sm font-medium text-white/90">{tier.name}</div>
                        <div className="text-xs text-white/50 mt-1">{tier.description}</div>
                      </button>
                    ))}
                  </div>
                </FieldContent>
              </Field>
            )}

            <Button
              type="submit"
              disabled={isLoading || isPending}
              className="w-full h-11 mt-2 bg-white/10 hover:bg-white/20 text-white border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isPending ? (
                <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
              ) : (
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* Toggle Register/Login */}
        <div
          className={`mt-8 text-center transition-all duration-1500 delay-600 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsRegister(!isRegister);
              setSelectedTier(TierType.EARLY_BIRD);
              setFieldErrors({});
            }}
            className="text-sm text-white/40 hover:text-white/80"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </Button>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
    </div>
  );
}
