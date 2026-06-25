import { ReactNode } from 'react';
import { ResumeProvider } from '@/contexts/resume-context';
import { ResumeStepper } from '@/components/resume/resume-stepper';
import { MobileStepper } from '@/components/resume/mobile-stepper';
import { ResumeHeader } from '@/components/resume/resume-header';

// Next.js 15: params is a Promise
export default async function ResumeBuilderLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;  // AWAIT IT

  if (!resumeId) {
    throw new Error('Resume ID is required');
  }

  return (
    <ResumeProvider resumeId={resumeId}>
      <div className="min-h-svh bg-slate-50">
        <ResumeHeader resumeId={resumeId} />
        <MobileStepper resumeId={resumeId} />
        <div className="flex">
          <aside className="w-64 hidden lg:block bg-white border-r border-slate-200 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <ResumeStepper resumeId={resumeId} />
          </aside>
          <main className="flex-1 p-4 lg:p-10">
            <div className="max-w-3xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ResumeProvider>
  );
}