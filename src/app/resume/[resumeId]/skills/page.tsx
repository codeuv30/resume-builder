"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Wrench, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResume } from "@/hooks/use-resume";
import { AISkillSuggest } from "@/components/resume/ai-skill-suggest";
import { StepGuard } from "@/components/resume/step-guard";

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
    }),
  ),
});

type SkillsForm = z.infer<typeof skillsSchema>;

export default function SkillsPage() {
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
  } = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    if (resume?.skills) {
      reset({
        skills: resume.skills.length > 0 ? resume.skills : [],
      });
    }
  }, [resume, reset]);

  const onSubmit = async (data: SkillsForm) => {
    setIsSaving(true);
    try {
      await saveResume({ skills: data.skills });
      router.push(`/resume/${resumeId}/projects`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkills = (skillNames: string[]) => {
    skillNames.forEach((name) => {
      append({ name, level: "Intermediate" });
    });
  };

  const existingSkillNames = fields.map((f) => f.name);

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
          <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
          <p className="text-sm text-slate-500 mt-1">
            Showcase your technical and soft skills
          </p>
        </div>

        <AISkillSuggest
          onAddSkills={handleAddSkills}
          existingSkills={existingSkillNames}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No skills added yet
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Add your technical skills or use AI suggestions
              </p>
              <Button
                type="button"
                onClick={() => append({ name: "", level: "Intermediate" })}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4"
            >
              <div className="flex-1 space-y-2">
                <Label className="text-xs">Skill Name</Label>
                <Input
                  {...register(`skills.${index}.name`)}
                  placeholder="React.js"
                  className="h-10"
                />
                {errors.skills?.[index]?.name && (
                  <p className="text-xs text-red-500">
                    {errors.skills[index]?.name?.message}
                  </p>
                )}
              </div>
              <div className="w-40 space-y-2">
                <Label className="text-xs">Proficiency</Label>
                <select
                  {...register(`skills.${index}.level`)}
                  className="w-full h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {fields.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", level: "Intermediate" })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Skill
            </Button>
          )}

          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/resume/${resumeId}/education`)}
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
