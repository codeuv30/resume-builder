'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResume } from '@/hooks/use-resume';
import { STEP_ORDER, isStepCompleted, canAccessStep, type StepId } from '@/lib/resume-progress';

const steps = [
  { id: 'personal-info' as StepId, label: 'Personal Info' },
  { id: 'education' as StepId, label: 'Education' },
  { id: 'skills' as StepId, label: 'Skills' },
  { id: 'projects' as StepId, label: 'Projects' },
  { id: 'experience' as StepId, label: 'Experience' },
  { id: 'achievements' as StepId, label: 'Achievements' },
  { id: 'summary' as StepId, label: 'Summary' },
  { id: 'preview' as StepId, label: 'Preview' },
];

interface MobileStepperProps {
  resumeId: string;
}

export function MobileStepper({ resumeId }: MobileStepperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resume, isLoading } = useResume(resumeId);
  
  const segments = pathname.split('/').filter(Boolean);
  const currentStep = (segments[segments.length - 1] || 'personal-info') as StepId;
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  const currentLabel = steps.find(s => s.id === currentStep)?.label || 'Personal Info';

  if (isLoading) return null;

  const completedCount = steps.filter(s => isStepCompleted(resume, s.id)).length;

  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {currentLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {steps.map((step, index) => {
            const completed = isStepCompleted(resume, step.id);
            const accessible = canAccessStep(resume, step.id);
            
            return (
              <DropdownMenuItem
                key={step.id}
                onClick={() => accessible && router.push(`/resume/${resumeId}/${step.id}`)}
                disabled={!accessible}
                className={`flex items-center justify-between ${
                  !accessible ? 'opacity-50 cursor-not-allowed' : ''
                } ${index === currentIndex ? 'font-medium bg-slate-50' : ''}`}
              >
                <span className="flex items-center gap-2">
                  {completed ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : !accessible ? (
                    <Lock className="h-4 w-4 text-slate-400" />
                  ) : null}
                  {step.label}
                </span>
                {index === currentIndex && (
                  <span className="text-xs text-slate-400">{index + 1}/{steps.length}</span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500">
          {completedCount}/{steps.length}
        </span>
      </div>
    </div>
  );
}