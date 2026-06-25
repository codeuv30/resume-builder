'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useResume } from '@/hooks/use-resume';
import { STEP_ORDER, canAccessStep, getLastAccessibleStep, type StepId } from '@/lib/resume-progress';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepGuardProps {
  resumeId: string;
  children: React.ReactNode;
}

export function StepGuard({ resumeId, children }: StepGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resume, isLoading } = useResume(resumeId);

  const segments = pathname.split('/').filter(Boolean);
  const currentStep = (segments[segments.length - 1] || 'personal-info') as StepId;
  
  // Compute accessibility
  const isAccessible = !isLoading && resume ? canAccessStep(resume, currentStep) : true;
  const lastAccessibleStep = !isLoading && resume ? getLastAccessibleStep(resume) : 'personal-info';

  // Redirect if not accessible
  useEffect(() => {
    if (!isLoading && resume && !isAccessible) {
      console.log(`[StepGuard] Blocking ${currentStep}, redirecting to ${lastAccessibleStep}`);
      router.replace(`/resume/${resumeId}/${lastAccessibleStep}`);
    }
  }, [isLoading, resume, isAccessible, lastAccessibleStep, resumeId, router, currentStep]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Loading resume...</p>
      </div>
    );
  }

  // HARD BLOCK — don't render children
  if (!isAccessible) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-slate-300" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Step Locked</h3>
          <p className="text-sm text-slate-500 mb-4">
            Complete previous steps to unlock this page
          </p>
          <Button
            onClick={() => router.push(`/resume/${resumeId}/${lastAccessibleStep}`)}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}