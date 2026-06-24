'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, Link2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResume } from '@/hooks/use-resume';
import { useDebounce } from '@/hooks/use-debounce';

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  linkedIn: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
  jobTitle: z.string().min(1, 'Job title is required'),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading, saveResume } = useResume(resumeId);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      linkedIn: '',
      github: '',
      portfolio: '',
      jobTitle: '',
    },
  });

  // Populate form when resume loads
  useEffect(() => {
    if (resume?.personalInfo) {
      reset({
        fullName: resume.personalInfo.fullName || '',
        email: resume.personalInfo.email || '',
        phone: resume.personalInfo.phone || '',
        address: resume.personalInfo.address || '',
        city: resume.personalInfo.city || '',
        state: resume.personalInfo.state || '',
        zipCode: resume.personalInfo.zipCode || '',
        linkedIn: resume.personalInfo.linkedIn || '',
        github: resume.personalInfo.github || '',
        portfolio: resume.personalInfo.portfolio || '',
        jobTitle: resume.personalInfo.jobTitle || '',
      });
    }
  }, [resume, reset]);

  // Auto-save on debounce
  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 2000);

  useEffect(() => {
    if (isDirty && resume) {
      handleAutoSave(debouncedValues);
    }
  }, [debouncedValues]);

  const handleAutoSave = async (data: PersonalInfoForm) => {
    try {
      setIsSaving(true);
      await saveResume({
        personalInfo: {
          ...resume?.personalInfo,
          ...data,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: PersonalInfoForm) => {
    await handleAutoSave(data);
    router.push(`/resume/${resumeId}/education`);
  };

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-1">Let employers know how to reach you</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              Full Name
            </Label>
            <Input id="fullName" {...register('fullName')} placeholder="John Doe" />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-400" />
              Job Title
            </Label>
            <Input id="jobTitle" {...register('jobTitle')} placeholder="Senior Full Stack Developer" />
            {errors.jobTitle && <p className="text-xs text-red-500">{errors.jobTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              Email
            </Label>
            <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              Phone
            </Label>
            <Input id="phone" {...register('phone')} placeholder="1234567890" />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              Address
            </Label>
            <Input id="address" {...register('address')} placeholder="123 Main Street" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} placeholder="San Francisco" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register('state')} placeholder="CA" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedIn" className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-400" />
              LinkedIn
            </Label>
            <Input id="linkedIn" {...register('linkedIn')} placeholder="https://linkedin.com/in/johndoe" />
            {errors.linkedIn && <p className="text-xs text-red-500">{errors.linkedIn.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-400" />
              GitHub
            </Label>
            <Input id="github" {...register('github')} placeholder="https://github.com/johndoe" />
            {errors.github && <p className="text-xs text-red-500">{errors.github.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="portfolio" className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-400" />
              Portfolio Website
            </Label>
            <Input id="portfolio" {...register('portfolio')} placeholder="https://johndoe.dev" />
            {errors.portfolio && <p className="text-xs text-red-500">{errors.portfolio.message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
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