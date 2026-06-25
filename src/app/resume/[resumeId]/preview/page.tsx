'use client';

import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, ArrowLeft, Printer, FileText, Check, Palette, Layout, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/hooks/use-resume';
import { StepGuard } from '@/components/resume/step-guard';

// --- Template System ---

type TemplateStyle = 'modern' | 'classic' | 'minimal';

interface TemplateConfig {
  name: string;
  icon: React.ReactNode;
  headerLayout: 'centered' | 'left';
  sectionStyle: 'boxed' | 'lined' | 'spaced';
  accentColor: string;
  fontStyle: 'modern' | 'classic';
}

const TEMPLATES: Record<TemplateStyle, TemplateConfig> = {
  modern: {
    name: 'Modern',
    icon: <Layout className="h-4 w-4" />,
    headerLayout: 'left',
    sectionStyle: 'lined',
    accentColor: 'slate',
    fontStyle: 'modern',
  },
  classic: {
    name: 'Classic',
    icon: <Type className="h-4 w-4" />,
    headerLayout: 'centered',
    sectionStyle: 'boxed',
    accentColor: 'slate',
    fontStyle: 'classic',
  },
  minimal: {
    name: 'Minimal',
    icon: <Check className="h-4 w-4" />,
    headerLayout: 'left',
    sectionStyle: 'spaced',
    accentColor: 'slate',
    fontStyle: 'modern',
  },
};

// --- Components ---

function TemplateSelector({
  current,
  onChange,
}: {
  current: TemplateStyle;
  onChange: (t: TemplateStyle) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm">
      {(Object.keys(TEMPLATES) as TemplateStyle[]).map((key) => {
        const t = TEMPLATES[key];
        const isActive = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {t.icon}
            {t.name}
          </button>
        );
      })}
    </div>
  );
}

function ResumeContent({
  resume,
  template,
}: {
  resume: any;
  template: TemplateStyle;
}) {
  const personalInfo = resume.personalInfo || {};
  const skills = resume.skills || [];
  const education = resume.education || [];
  const workExperience = resume.workExperience || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const t = TEMPLATES[template];

  const isCentered = t.headerLayout === 'centered';
  const isBoxed = t.sectionStyle === 'boxed';
  const isLined = t.sectionStyle === 'lined';

  // Section title component based on template
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className={`text-sm font-bold uppercase tracking-widest mb-3 ${
        isBoxed
          ? 'bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md inline-block'
          : isLined
          ? 'text-slate-900 border-b-2 border-slate-900 pb-1.5'
          : 'text-slate-500 border-b border-slate-200 pb-2'
      }`}
    >
      {children}
    </h2>
  );

  const formatDate = (dateStr: string | undefined, format: 'monthYear' | 'year' = 'monthYear') => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    if (format === 'year') return d.getFullYear().toString();
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const dateRange = (start?: string, end?: string, isCurrent?: boolean) => {
    const startStr = start ? formatDate(start) : '';
    const endStr = isCurrent ? 'Present' : end ? formatDate(end) : '';
    if (!startStr && !endStr) return '';
    return `${startStr}${startStr || endStr ? ' — ' : ''}${endStr}`;
  };

  return (
    <div className={`space-y-6 ${t.fontStyle === 'classic' ? 'font-serif' : 'font-sans'}`}>
      {/* Header */}
      <div
        className={`${
          isCentered ? 'text-center' : ''
        } ${isBoxed ? 'border-b-2 border-slate-900 pb-6' : 'border-b border-slate-200 pb-6'}`}
      >
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-slate-600 mt-1.5 font-medium">
          {personalInfo.jobTitle || 'Job Title'}
        </p>
        <div
          className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500 ${
            isCentered ? 'justify-center' : ''
          }`}
        >
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">✉</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">☎</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.city && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">📍</span>
              {personalInfo.city}
              {personalInfo.state ? `, ${personalInfo.state}` : ''}
            </span>
          )}
          {personalInfo.linkedIn && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">🔗</span>
              <span className="text-slate-700">{personalInfo.linkedIn.replace(/^https?:\/\//, '')}</span>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">⚡</span>
              <span className="text-slate-700">{personalInfo.github.replace(/^https?:\/\//, '')}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">🌐</span>
              <span className="text-slate-700">{personalInfo.website.replace(/^https?:\/\//, '')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div>
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-sm text-slate-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, i: number) => (
              <span
                key={i}
                className={`text-sm ${
                  isBoxed
                    ? 'px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-md'
                    : 'text-slate-700'
                }`}
              >
                {typeof skill === 'string' ? skill : `${skill.name}${skill.level ? ` (${skill.level})` : ''}`}
                {isBoxed && i < skills.length - 1 ? '' : !isBoxed && i < skills.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <div>
          <SectionTitle>Work Experience</SectionTitle>
          <div className="space-y-5">
            {workExperience.map((exp: any, i: number) => (
              <div key={i} className="group">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{exp.position}</h3>
                    <p className="text-sm text-slate-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded">
                    {dateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">{exp.description}</p>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-4">
            {projects.map((project: any, i: number) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-500 hover:text-slate-700 underline decoration-slate-300 underline-offset-2"
                    >
                      {project.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-4">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{edu.school}</h3>
                    <p className="text-sm text-slate-600">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    {dateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-sm text-slate-500 mt-1.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications</SectionTitle>
          <div className="space-y-3">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="font-semibold text-slate-900">{cert.name}</span>
                  <span className="text-slate-500 text-sm"> — {cert.issuer}</span>
                </div>
                <span className="text-sm text-slate-500">
                  {cert.date ? formatDate(cert.date) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading } = useResume(resumeId);
  const printRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateStyle>('modern');

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <span>Loading preview...</span>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        Resume not found
      </div>
    );
  }

  return (
    <StepGuard resumeId={resumeId}>
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Preview</h2>
            <p className="text-sm text-slate-500 mt-1">
              Review your resume and choose a template
            </p>
          </div>
          <div className="flex items-center gap-3 no-print flex-wrap">
            <TemplateSelector current={template} onChange={setTemplate} />
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print / PDF
            </Button>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800"
              onClick={() => router.push(`/resume/${resumeId}/personal-info`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
          </div>
        </div>

        {/* Resume Preview */}
        <div
          ref={printRef}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 max-w-[210mm] mx-auto print:shadow-none print:border-none print:rounded-none print:p-0"
        >
          <ResumeContent resume={resume} template={template} />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between no-print">
          <Button
            variant="outline"
            onClick={() => router.push(`/resume/${resumeId}/summary`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summary
          </Button>
          <Button
            className="bg-slate-900 hover:bg-slate-800"
            onClick={handlePrint}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            .no-print { display: none !important; }
            body { background: white; }
            @page { margin: 15mm; }
          }
        `}</style>
      </div>
    </StepGuard>
  );
}