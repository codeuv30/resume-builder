import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account | DevResume AI',
  description: 'Create your DevResume AI account',
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="text-sm text-slate-500">
          Start building your AI-powered resume today
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}