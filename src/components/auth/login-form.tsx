'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import api from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        // Store token in localStorage (as per your current backend setup)
        // Note: For production, consider httpOnly cookies instead
        const token = response.headers['authorization'] || response.data.token;
        if (token) {
          localStorage.setItem('token', token.replace('Bearer ', ''));
        }
        
        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        router.push('/resume');
        router.refresh();
      }
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || 
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 transition-all"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-10 pr-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 transition-all"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          {...register('rememberMe')}
        />
        <Label
          htmlFor="rememberMe"
          className="text-sm font-normal text-slate-600 cursor-pointer"
        >
          Remember me for 30 days
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link
          href="/auth/register"
          className="font-medium text-slate-900 hover:text-slate-700 underline underline-offset-4 transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}