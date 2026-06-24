'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const steps = [
  { id: 'personal-info', label: 'Personal Info' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'summary', label: 'Summary' },
  { id: 'preview', label: 'Preview' },
];

export function MobileStepper({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = pathname.split('/').pop() || 'personal-info';
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  const currentLabel = steps.find(s => s.id === currentStep)?.label || 'Personal Info';

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
          {steps.map((step, index) => (
            <DropdownMenuItem
              key={step.id}
              onClick={() => router.push(`/resume/${resumeId}/${step.id}`)}
              className="flex items-center justify-between"
            >
              <span className={index === currentIndex ? 'font-medium' : ''}>{step.label}</span>
              {index < currentIndex && <Check className="h-4 w-4 text-emerald-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="text-sm text-slate-500">
        {currentIndex + 1} / {steps.length}
      </span>
    </div>
  );
}