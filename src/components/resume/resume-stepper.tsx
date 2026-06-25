'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, GraduationCap, Wrench, FolderGit, Briefcase, 
  Award, FileText, Eye, CheckCircle2, Circle, Lock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResume } from '@/hooks/use-resume';
import { STEP_ORDER, isStepCompleted, canAccessStep, type StepId, getLastCompletedStep } from '@/lib/resume-progress';

const stepConfig = [
  { id: 'personal-info' as StepId, label: 'Personal Info', icon: User },
  { id: 'education' as StepId, label: 'Education', icon: GraduationCap },
  { id: 'skills' as StepId, label: 'Skills', icon: Wrench },
  { id: 'projects' as StepId, label: 'Projects', icon: FolderGit },
  { id: 'experience' as StepId, label: 'Experience', icon: Briefcase },
  { id: 'achievements' as StepId, label: 'Achievements', icon: Award },
  { id: 'summary' as StepId, label: 'Summary', icon: FileText },
  { id: 'preview' as StepId, label: 'Preview', icon: Eye },
];

interface ResumeStepperProps {
  resumeId: string;
}

export function ResumeStepper({ resumeId }: ResumeStepperProps) {
  const pathname = usePathname();
  const { resume, isLoading } = useResume(resumeId);
  
  const segments = pathname.split('/').filter(Boolean);
  const currentStep = (segments[segments.length - 1] || 'personal-info') as StepId;

  // DEBUG
  console.log('[Stepper] resume:', resume ? {
    id: resume._id,
    personalInfo: resume.personalInfo,
    skills: resume.skills,
    education: resume.education,
    projects: resume.projects,
  } : null);
  console.log('[Stepper] lastCompleted:', resume ? getLastCompletedStep(resume) : 'no resume');

  if (isLoading) {
    return (
      <nav className="space-y-1 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="h-10 bg-slate-50 rounded-lg mb-1" />
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Resume Builder
      </p>
      
      {stepConfig.map((step, index) => {
        const completed = isStepCompleted(resume, step.id);
        const active = step.id === currentStep;
        const accessible = canAccessStep(resume, step.id);
        const Icon = step.icon;

        // DEBUG
        console.log(`[Stepper] ${step.id}: completed=${completed}, active=${active}, accessible=${accessible}`);

        if (!accessible && !active) {
          return (
            <div
              key={step.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed select-none"
              title="Complete previous steps first"
            >
              <Lock className="h-4 w-4 shrink-0" />
              <span className="truncate">{step.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={step.id}
            href={`/resume/${resumeId}/${step.id}`}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              active && 'bg-slate-900 text-white shadow-sm',
              completed && !active && 'text-slate-700 hover:bg-slate-100',
              !active && !completed && 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            )}
          >
            {completed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : active ? (
              <Icon className="h-4 w-4 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{step.label}</span>
            {active && (
              <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded text-white">
                {index + 1}/{stepConfig.length}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}