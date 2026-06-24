'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, GraduationCap, Wrench, FolderGit, Briefcase, 
  Award, FileText, Eye, CheckCircle2, Circle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'personal-info', label: 'Personal Info', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'preview', label: 'Preview', icon: Eye },
];

export function ResumeStepper({ resumeId }: { resumeId: string }) {
  const pathname = usePathname();
  const currentStep = pathname.split('/').pop() || 'personal-info';
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <nav className="space-y-1">
      <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Resume Builder
      </p>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = step.id === currentStep;
        const Icon = step.icon;

        return (
          <Link
            key={step.id}
            href={`/resume/${resumeId}/${step.id}`}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isActive && 'bg-slate-900 text-white shadow-sm',
              isCompleted && 'text-slate-700 hover:bg-slate-100',
              !isActive && !isCompleted && 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : isActive ? (
              <Icon className="h-4 w-4 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{step.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}