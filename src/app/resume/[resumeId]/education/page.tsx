"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useResume } from "@/hooks/use-resume";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Controller } from "react-hook-form";
import { StepGuard } from "@/components/resume/step-guard";

const educationSchema = z.object({
  education: z.array(
    z.object({
      school: z.string().min(1, "School name is required"),
      degree: z.string().min(1, "Degree is required"),
      fieldOfStudy: z.string().min(1, "Field of study is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().default(""), // string, never undefined
      description: z.string().default(""), // string, never undefined
      isCurrent: z.boolean().default(false), // boolean, never undefined
    }),
  ),
});

type EducationForm = z.infer<typeof educationSchema>;

export default function EducationPage() {
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
    watch,
    formState: { errors, isDirty },
  } = useForm<EducationForm>({
    resolver: zodResolver(educationSchema) as any,
    defaultValues: { education: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    if (resume?.education) {
      reset({ education: resume.education.length > 0 ? resume.education : [] });
    }
  }, [resume, reset]);

  const onSubmit = async (data: EducationForm) => {
    setIsSaving(true);
    try {
      await saveResume({ education: data.education });
      router.push(`/resume/${resumeId}/skills`);
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => {
    append({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "", // already correct
      description: "", // already correct
      isCurrent: false,
    });
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <StepGuard resumeId={resumeId}>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Education</h2>
        <p className="text-sm text-slate-500 mt-1">
          Add your academic background
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No education added yet
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Add your degrees, certifications, and courses
            </p>
            <Button type="button" onClick={addEducation} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                Education #{index + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>School / University</Label>
                <Controller
                  control={control}
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <AutocompleteInput
                      {...field}
                      placeholder="Stanford University"
                      onValueChange={field.onChange}
                    />
                  )}
                />
                {errors.education?.[index]?.school && (
                  <p className="text-xs text-red-500">
                    {errors.education[index]?.school?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  {...register(`education.${index}.degree`)}
                  placeholder="Bachelor of Science"
                />
              </div>

              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  {...register(`education.${index}.fieldOfStudy`)}
                  placeholder="Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  {...register(`education.${index}.startDate`)}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register(`education.${index}.endDate`)}
                  disabled={watch(`education.${index}.isCurrent`)}
                />
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id={`current-${index}`}
                  {...register(`education.${index}.isCurrent`)}
                />
                <Label
                  htmlFor={`current-${index}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  Currently studying here
                </Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description (Optional)</Label>
                <textarea
                  {...register(`education.${index}.description`)}
                  placeholder="Relevant coursework, achievements, GPA..."
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
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Education
          </Button>
        )}

        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/resume/${resumeId}/personal-info`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-xs text-slate-500">Saving...</span>
            )}
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
