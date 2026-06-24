'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Briefcase, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useResume } from '@/hooks/use-resume';
import { AITextGenerate } from '@/components/resume/ai-text-generate';
import { useAIGeneration } from '@/hooks/use-ai';

const experienceSchema = z.object({
  workExperience: z.array(z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional().default(''),
    description: z.string().min(1, 'Description is required'),
    isCurrent: z.boolean().default(false),
    technologies: z.array(z.string()).default([]),
  })),
});

type ExperienceForm = z.infer<typeof experienceSchema>;

export default function ExperiencePage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading, saveResume } = useResume(resumeId);
  const { generateExperienceDescription } = useAIGeneration();
  const [isSaving, setIsSaving] = useState(false);
  const [techInputs, setTechInputs] = useState<Record<number, string>>({});

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema) as any,
    defaultValues: { workExperience: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperience',
  });

  useEffect(() => {
    if (resume?.workExperience) {
      reset({ workExperience: resume.workExperience.length > 0 ? resume.workExperience : [] });
    }
  }, [resume, reset]);

  const addTechnology = (expIndex: number) => {
    const tech = techInputs[expIndex]?.trim();
    if (!tech) return;
    const currentTechs = watch(`workExperience.${expIndex}.technologies`) || [];
    if (!currentTechs.includes(tech)) {
      setValue(`workExperience.${expIndex}.technologies`, [...currentTechs, tech]);
    }
    setTechInputs(prev => ({ ...prev, [expIndex]: '' }));
  };

  const removeTechnology = (expIndex: number, tech: string) => {
    const currentTechs = watch(`workExperience.${expIndex}.technologies`) || [];
    setValue(
      `workExperience.${expIndex}.technologies`,
      currentTechs.filter(t => t !== tech)
    );
  };

  const onSubmit = async (data: ExperienceForm) => {
    setIsSaving(true);
    try {
      await saveResume({ workExperience: data.workExperience });
      router.push(`/resume/${resumeId}/achievements`);
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
        <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
        <p className="text-sm text-slate-500 mt-1">Tell us about your professional journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No experience added yet</h3>
            <p className="text-sm text-slate-500 mb-4">Add your work history and achievements</p>
            <Button
              type="button"
              onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '', isCurrent: false, technologies: [] })}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        )}

        {fields.map((field, index) => {
          const technologies = watch(`workExperience.${index}.technologies`) || [];
          return (
            <div key={field.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Experience #{index + 1}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input {...register(`workExperience.${index}.company`)} placeholder="Google" />
                  {errors.workExperience?.[index]?.company && <p className="text-xs text-red-500">{errors.workExperience[index]?.company?.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input {...register(`workExperience.${index}.position`)} placeholder="Senior Developer" />
                  {errors.workExperience?.[index]?.position && <p className="text-xs text-red-500">{errors.workExperience[index]?.position?.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" {...register(`workExperience.${index}.startDate`)} />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="date" 
                    {...register(`workExperience.${index}.endDate`)} 
                    disabled={watch(`workExperience.${index}.isCurrent`)}
                  />
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                  <Checkbox 
                    id={`exp-current-${index}`} 
                    {...register(`workExperience.${index}.isCurrent`)} 
                  />
                  <Label htmlFor={`exp-current-${index}`} className="text-sm font-normal cursor-pointer">
                    I currently work here
                  </Label>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Job Description</Label>
                    <AITextGenerate
                      title="Generate Experience Description"
                      contextLabel="Position, company & tech"
                      contextPlaceholder="e.g. Senior Developer at Google, React, Node.js"
                      generateFn={async (context) => {
                        const parts = context.split(',').map(s => s.trim());
                        const position = parts[0] || 'Developer';
                        const company = parts[1] || 'Company';
                        const techs = parts.slice(2);
                        return generateExperienceDescription(position, company, techs.length > 0 ? techs : ['React']);
                      }}
                      onApply={(text) => setValue(`workExperience.${index}.description`, text)}
                    />
                  </div>
                  <textarea
                    {...register(`workExperience.${index}.description`)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400"
                  />
                  {errors.workExperience?.[index]?.description && <p className="text-xs text-red-500">{errors.workExperience[index]?.description?.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Technologies Used</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {technologies.map((tech) => (
                      <span key={tech} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index, tech)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g. React)"
                      value={techInputs[index] || ''}
                      onChange={(e) => setTechInputs(prev => ({ ...prev, [index]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechnology(index);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => addTechnology(index)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '', isCurrent: false, technologies: [] })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Experience
          </Button>
        )}

        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/resume/${resumeId}/projects`)}
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
  );
}