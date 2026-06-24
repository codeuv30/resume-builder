'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, FileText, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useResume } from '@/hooks/use-resume';
import { useAIGeneration } from '@/hooks/use-ai';
import { Input } from '@/components/ui/input';

const summarySchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  summary: z.string().min(50, 'Summary should be at least 50 characters').max(1000, 'Summary should be less than 1000 characters'),
});

type SummaryForm = z.infer<typeof summarySchema>;

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading, saveResume } = useResume(resumeId);
  const { generateSummary, isGenerating } = useAIGeneration();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SummaryForm>({
    resolver: zodResolver(summarySchema),
    defaultValues: { title: '', summary: '' },
  });

  const summary = watch('summary');

  useEffect(() => {
    if (resume) {
      reset({
        title: resume.title || '',
        summary: resume.summary || '',
      });
    }
  }, [resume, reset]);

  const handleGenerateSummary = async () => {
    const context = `${resume?.personalInfo?.jobTitle || 'Software Developer'} with skills in ${resume?.skills?.map(s => typeof s === 'string' ? s : s.name).join(', ')}`;
    const generated = await generateSummary(context);
    setValue('summary', generated);
  };

  const onSubmit = async (data: SummaryForm) => {
    setIsSaving(true);
    try {
      await saveResume({ title: data.title, summary: data.summary });
      router.push(`/resume/${resumeId}/preview`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Professional Summary</h2>
        <p className="text-sm text-slate-500 mt-1">Craft a compelling summary of your career</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Resume Title
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g. Senior Full Stack Developer Resume"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Professional Summary</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate with AI
            </Button>
          </div>
          <textarea
            id="summary"
            {...register('summary')}
            placeholder="Write a 3-5 sentence summary highlighting your experience, key skills, and career goals..."
            className="w-full min-h-[200px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 resize-y"
          />
          <div className="flex items-center justify-between">
            {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
            <span className={`text-xs ml-auto ${summary?.length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
              {summary?.length || 0} / 1000
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/resume/${resumeId}/achievements`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {isSaving && <span className="text-xs text-slate-500">Saving...</span>}
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
              Preview Resume
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}