'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResume } from '@/hooks/use-resume';
import { StepGuard } from '@/components/resume/step-guard';

const achievementsSchema = z.object({
  certifications: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    description: z.string()
  })),
});

type AchievementsForm = z.infer<typeof achievementsSchema>;

export default function AchievementsPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading, saveResume } = useResume(resumeId);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AchievementsForm>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: { certifications: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  useEffect(() => {
    if (resume?.certifications) {
      reset({ certifications: resume.certifications.length > 0 ? resume.certifications : [] });
    }
  }, [resume, reset]);

  const onSubmit = async (data: AchievementsForm) => {
    setIsSaving(true);
    try {
      await saveResume({ certifications: data.certifications });
      router.push(`/resume/${resumeId}/summary`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <StepGuard resumeId={resumeId}>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Achievements & Certifications</h2>
        <p className="text-sm text-slate-500 mt-1">Showcase your credentials and accomplishments</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No achievements added yet</h3>
            <p className="text-sm text-slate-500 mb-4">Add certifications, awards, and recognitions</p>
            <Button
              type="button"
              onClick={() => append({ name: '', issuer: '', date: '', description: '' })}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Achievement #{index + 1}</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Title / Certification Name</Label>
                <Input {...register(`certifications.${index}.name`)} placeholder="AWS Certified Solutions Architect" />
                {errors.certifications?.[index]?.name && <p className="text-xs text-red-500">{errors.certifications[index]?.name?.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input {...register(`certifications.${index}.issuer`)} placeholder="Amazon Web Services" />
              </div>

              <div className="space-y-2">
                <Label>Date Earned</Label>
                <Input type="date" {...register(`certifications.${index}.date`)} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description (Optional)</Label>
                <textarea
                  {...register(`certifications.${index}.description`)}
                  placeholder="Details about the certification or achievement..."
                  className="w-full min-h-[80px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        ))}

        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', issuer: '', date: '', description: '' })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Achievement
          </Button>
        )}

        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/resume/${resumeId}/experience`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {isSaving && <span className="text-xs text-slate-500">Saving...</span>}
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
    </StepGuard>
  );
}