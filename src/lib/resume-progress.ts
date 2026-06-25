import type { Resume } from '@/types/resume';

export const STEP_ORDER = [
  'personal-info',
  'education',
  'skills',
  'projects',
  'experience',
  'achievements',
  'summary',
  'preview',
] as const;

export type StepId = typeof STEP_ORDER[number];

export function isStepCompleted(resume: Resume | null, stepId: StepId): boolean {
  if (!resume) return false;

  switch (stepId) {
    case 'personal-info':
      return !!(
        resume.personalInfo?.fullName &&
        resume.personalInfo?.email &&
        resume.personalInfo?.phone &&
        resume.personalInfo?.jobTitle
      );
    
    case 'education':
      return resume.education && resume.education.length > 0;
    
    case 'skills':
      return resume.skills && resume.skills.length > 0;
    
    case 'projects':
      return resume.projects && resume.projects.length > 0;
    
    case 'experience':
      return resume.workExperience && resume.workExperience.length > 0;
    
    case 'achievements':
      // FIXED: Check if certifications array has items
      return resume.certifications && resume.certifications.length > 0;
    
    case 'summary':
      return !!(resume.summary && resume.summary.length > 50 && resume.title);
    
    case 'preview':
      // Preview is never "completed" — it's a view-only step
      return false;
    
    default:
      return false;
  }
}

export function getLastCompletedStep(resume: Resume | null): number {
  if (!resume) return -1;
  
  for (let i = STEP_ORDER.length - 1; i >= 0; i--) {
    if (isStepCompleted(resume, STEP_ORDER[i])) {
      return i;
    }
  }
  return -1;
}

export function canAccessStep(resume: Resume | null, targetStepId: StepId): boolean {
  if (!resume) return targetStepId === 'personal-info';
  
  const targetIndex = STEP_ORDER.indexOf(targetStepId);
  const lastCompleted = getLastCompletedStep(resume);
  
  // STRICT: Can only access completed steps OR the immediate next step
  return targetIndex <= lastCompleted + 1;
}

export function getLastAccessibleStep(resume: Resume | null): StepId {
  if (!resume) return 'personal-info';
  
  const lastCompleted = getLastCompletedStep(resume);
  
  // Next step after last completed is accessible
  if (lastCompleted >= 0 && lastCompleted < STEP_ORDER.length - 1) {
    return STEP_ORDER[lastCompleted + 1];
  }
  
  return STEP_ORDER[0];
}

export function getNextStep(currentStepId: StepId): StepId | null {
  const currentIndex = STEP_ORDER.indexOf(currentStepId);
  if (currentIndex === -1 || currentIndex >= STEP_ORDER.length - 1) return null;
  return STEP_ORDER[currentIndex + 1];
}

export function getPrevStep(currentStepId: StepId): StepId | null {
  const currentIndex = STEP_ORDER.indexOf(currentStepId);
  if (currentIndex <= 0) return null;
  return STEP_ORDER[currentIndex - 1];
}