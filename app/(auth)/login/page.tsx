"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
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
import { useAuthStore } from '@/store/auth-store';
import { CabLogoFull } from '@/components/shared/logo/CabLogo';

/**
 * Login Page
 *
 * Note: AuthProvider handles:
 * - Redirecting to /dashboard if already authenticated
 * - Showing loading while auth state initializes
 *
 * This component only needs to handle the login form.
 */
export default function LoginPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@veo.com',
    password: 'demo123',
    name: '',
  });

  const { login, register, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    clearError();
  }, [isRegister, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (isRegister) {
      success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
    } else {
      success = await login({
        email: formData.email,
        password: formData.password,
      });
    }

    if (success) {
      router.push('/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-linear-to-br from-slate-900 via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
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
          className={`mb-8 text-center transition-all duration-1500 delay-200 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-white/40">
            {isRegister ? 'Join the exclusive wealth management platform' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`w-full transition-all duration-1500 delay-400 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
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
                    required
                  />
                </FieldContent>
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
                  required
                />
              </FieldContent>
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
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 h-7 w-7"
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>
                </div>
              </FieldContent>
            </Field>

            {error && (
              <FieldError>
                {error}
              </FieldError>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              {isLoading ? (
                <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
              ) : (
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              )}
            </Button>

            {/* Demo credentials hint */}
            {!isRegister && (
              <FieldDescription className="text-center! mt-4">
                Demo: demo@veo.com / demo123
              </FieldDescription>
            )}
          </FieldGroup>
        </form>

        {/* Toggle Register/Login */}
        <div
          className={`mt-8 text-center transition-all duration-1500 delay-600 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsRegister(!isRegister)}
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
