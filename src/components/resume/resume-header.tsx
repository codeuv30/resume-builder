'use client';

import Link from 'next/link';
import { useResume } from '@/hooks/use-resume';
import { Button } from '@/components/ui/button';
import { Download, Save, Loader2 } from 'lucide-react';
import { useResumeContext } from '@/contexts/resume-context';

interface ResumeHeaderProps {
  resumeId: string;  // <-- Use prop
}

export function ResumeHeader({ resumeId }: ResumeHeaderProps) {
  const { resume, isSaving } = useResumeContext();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between">
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-slate-900 truncate">
          {resume?.title || 'Untitled Resume'}
        </h1>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="h-3 w-3" />
              All changes saved
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/resume/${resumeId}/preview`}>
            <Download className="h-4 w-4 mr-2" />
            Preview
          </Link>
        </Button>
      </div>
    </header>
  );
}