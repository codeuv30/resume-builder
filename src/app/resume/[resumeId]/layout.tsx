import { ReactNode } from 'react';
import { ResumeStepper } from '@/components/resume/resume-stepper';
import { MobileStepper } from '@/components/resume/mobile-stepper';
import { ResumeHeader } from '@/components/resume/resume-header';

export default function ResumeBuilderLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { resumeId: string };
}) {
  return (
    <div className="min-h-svh bg-slate-50">
      <ResumeHeader resumeId={params.resumeId} />
      <MobileStepper resumeId={params.resumeId} />
      <div className="flex">
        <aside className="w-64 hidden lg:block bg-white border-r border-slate-200 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <ResumeStepper resumeId={params.resumeId} />
        </aside>
        <main className="flex-1 p-4 lg:p-10">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}