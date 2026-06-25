'use client';

import { useResumeContext } from '@/contexts/resume-context';

export function useResume(resumeId: string) {
  // Use the shared context instead of local state
  const { resume, isLoading, isSaving, error, refreshResume, saveResume } = useResumeContext();
  
  return { resume, isLoading, isSaving, error, saveResume, refresh: refreshResume };
}