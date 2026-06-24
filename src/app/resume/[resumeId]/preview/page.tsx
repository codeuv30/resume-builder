'use client';

import { useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, ArrowLeft, Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/hooks/use-resume';

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading } = useResume(resumeId);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-slate-400">Loading preview...</div>;
  }

  if (!resume) {
    return <div className="h-96 flex items-center justify-center text-slate-400">Resume not found</div>;
  }

  const personalInfo = resume.personalInfo || {};
  const skills = resume.skills || [];
  const education = resume.education || [];
  const workExperience = resume.workExperience || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Preview</h2>
          <p className="text-sm text-slate-500 mt-1">Review your resume before downloading</p>
        </div>
        <div className="flex items-center gap-3 no-print">
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

      <div
        ref={printRef}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 max-w-[210mm] mx-auto print:shadow-none print:border-none print:rounded-none"
      >
        {/* Resume Template */}
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6">
            <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-lg text-slate-600 mt-1">{personalInfo.jobTitle || 'Job Title'}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.city && <span>{personalInfo.city}{personalInfo.state ? `, ${personalInfo.state}` : ''}</span>}
              {personalInfo.linkedIn && <span className="text-slate-700">{personalInfo.linkedIn}</span>}
              {personalInfo.github && <span className="text-slate-700">{personalInfo.github}</span>}
            </div>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
                Professional Summary
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    {typeof skill === 'string' ? skill : `${skill.name}${skill.level ? ` (${skill.level})` : ''}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {workExperience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                      <span className="text-sm text-slate-500">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                        {' - '}
                        {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{exp.company}</p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{exp.description}</p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.technologies.map(tech => (
                          <span key={tech} className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{tech}</span>
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
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-700">
                          {project.link}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map(tech => (
                          <span key={tech} className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{tech}</span>
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
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-slate-900">{edu.school}</h3>
                      <span className="text-sm text-slate-500">
                        {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
                    {edu.description && <p className="text-sm text-slate-500 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <div>
                      <span className="font-medium text-slate-900">{cert.name}</span>
                      <span className="text-slate-500 text-sm"> — {cert.issuer}</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {cert.date ? new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}