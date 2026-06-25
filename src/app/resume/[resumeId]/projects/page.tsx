"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  FolderGit,
  ArrowRight,
  ArrowLeft,
  Link2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResume } from "@/hooks/use-resume";
import { AITextGenerate } from "@/components/resume/ai-text-generate";
import { useAIGeneration } from "@/hooks/use-ai";
import { StepGuard } from "@/components/resume/step-guard";

const projectsSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(1, "Project name is required"),
      description: z.string().min(1, "Description is required"),
      technologies: z.array(z.string()).min(1, "Add at least one technology"),
      link: z.string().url("Invalid URL").or(z.literal("")).default(""),
      startDate: z.string().default(""),
      endDate: z.string().default(""),
    }),
  ),
});

type ProjectsForm = z.infer<typeof projectsSchema>;

export default function ProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading, saveResume } = useResume(resumeId);
  const { generateProjectDescription } = useAIGeneration();
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
  } = useForm<ProjectsForm>({
    resolver: zodResolver(projectsSchema) as any,
    defaultValues: { projects: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    if (resume?.projects) {
      reset({ projects: resume.projects.length > 0 ? resume.projects : [] });
    }
  }, [resume, reset]);

  const addTechnology = (projectIndex: number) => {
    const tech = techInputs[projectIndex]?.trim();
    if (!tech) return;
    const currentTechs = watch(`projects.${projectIndex}.technologies`) || [];
    if (!currentTechs.includes(tech)) {
      setValue(`projects.${projectIndex}.technologies`, [
        ...currentTechs,
        tech,
      ]);
    }
    setTechInputs((prev) => ({ ...prev, [projectIndex]: "" }));
  };

  const removeTechnology = (projectIndex: number, tech: string) => {
    const currentTechs = watch(`projects.${projectIndex}.technologies`) || [];
    setValue(
      `projects.${projectIndex}.technologies`,
      currentTechs.filter((t) => t !== tech),
    );
  };

  const onSubmit = async (data: ProjectsForm) => {
    setIsSaving(true);
    try {
      await saveResume({ projects: data.projects });
      router.push(`/resume/${resumeId}/experience`);
    } finally {
      setIsSaving(false);
    }
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
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">
            Highlight your best work
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <FolderGit className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No projects added yet
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Showcase your portfolio projects
              </p>
              <Button
                type="button"
                onClick={() =>
                  append({
                    name: "",
                    description: "",
                    technologies: [],
                    link: "",
                    startDate: "",
                    endDate: "",
                  })
                }
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          )}

          {fields.map((field, index) => {
            const technologies = watch(`projects.${index}.technologies`) || [];
            return (
              <div
                key={field.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    Project #{index + 1}
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
                    <Label>Project Name</Label>
                    <Input
                      {...register(`projects.${index}.name`)}
                      placeholder="E-Commerce Platform"
                    />
                    {errors.projects?.[index]?.name && (
                      <p className="text-xs text-red-500">
                        {errors.projects[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label>Description</Label>
                      <AITextGenerate
                        title="Generate Project Description"
                        fields={[
                          {
                            key: "projectName",
                            label: "Project Name",
                            placeholder: "e.g. E-Commerce Platform",
                          },
                          {
                            key: "technologies",
                            label: "Technologies (comma-separated)",
                            placeholder: "e.g. React, Node.js, PostgreSQL",
                          },
                        ]}
                        generateFn={async (values) => {
                          const techs = values.technologies
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          return generateProjectDescription(
                            values.projectName,
                            techs,
                          );
                        }}
                        onApply={(text) =>
                          setValue(`projects.${index}.description`, text)
                        }
                      />
                    </div>
                    <textarea
                      {...register(`projects.${index}.description`)}
                      placeholder="Describe the project, your role, and impact..."
                      className="w-full min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400"
                    />
                    {errors.projects?.[index]?.description && (
                      <p className="text-xs text-red-500">
                        {errors.projects[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Technologies Used</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
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
                        value={techInputs[index] || ""}
                        onChange={(e) =>
                          setTechInputs((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechnology(index);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTechnology(index)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.projects?.[index]?.technologies && (
                      <p className="text-xs text-red-500">
                        {errors.projects[index]?.technologies?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-slate-400" />
                      Project Link
                    </Label>
                    <Input
                      {...register(`projects.${index}.link`)}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        {...register(`projects.${index}.startDate`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        {...register(`projects.${index}.endDate`)}
                      />
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
              onClick={() =>
                append({
                  name: "",
                  description: "",
                  technologies: [],
                  link: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Project
            </Button>
          )}

          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/resume/${resumeId}/skills`)}
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