'use client';

import { useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Check, Layout, Type, AlignLeft, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/hooks/use-resume';
import { StepGuard } from '@/components/resume/step-guard';
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayoutId = 'classic' | 'modern' | 'compact' | 'sidebar';

interface LayoutConfig {
  id: LayoutId;
  name: string;
  description: string;
  icon: React.ReactNode;
  atsScore: number;
}

const LAYOUTS: Record<LayoutId, LayoutConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Centred header, serif feel',
    icon: <Type className="h-4 w-4" />,
    atsScore: 98,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Left-aligned, clean rules',
    icon: <AlignLeft className="h-4 w-4" />,
    atsScore: 97,
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Dense, one-page optimised',
    icon: <Grid3x3 className="h-4 w-4" />,
    atsScore: 96,
  },
  sidebar: {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Two-column with sidebar',
    icon: <Layout className="h-4 w-4" />,
    atsScore: 88,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function dateRange(start?: string, end?: string, isCurrent?: boolean): string {
  const s = start ? fmtDate(start) : '';
  const e = isCurrent ? 'Present' : end ? fmtDate(end) : '';
  if (!s && !e) return '';
  return `${s}${s && e ? ' – ' : ''}${e}`;
}

function stripUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

// Strips AI-generated markdown so text renders as clean prose
function stripMd(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/\*(.+?)\*/gs,     '$1')
    .replace(/__(.+?)__/gs,     '$1')
    .replace(/_(.+?)_/gs,       '$1')
    .replace(/`(.+?)`/gs,       '$1')
    .replace(/^#{1,6}\s+/gm,    '')
    .replace(/^[-*+]\s+/gm,     '')
    .replace(/^\d+\.\s+/gm,     '')
    .trim();
}

function useResumeData(resume: any) {
  return {
    info:           resume?.personalInfo ?? {},
    summary:        stripMd(resume?.summary ?? ''),
    skills:         (resume?.skills         ?? []) as any[],
    experience:     (resume?.workExperience ?? []) as any[],
    projects:       (resume?.projects       ?? []) as any[],
    education:      (resume?.education      ?? []) as any[],
    certifications: (resume?.certifications ?? []) as any[],
  };
}

// ─── Layout: Classic ─────────────────────────────────────────────────────────

function ClassicLayout({ resume }: { resume: any }) {
  const { info, summary, skills, experience, projects, education, certifications } = useResumeData(resume);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-800 border-b border-slate-800 pb-0.5 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="font-serif text-[12px] leading-[1.55] text-slate-800 space-y-5">
      <header className="text-center border-b border-slate-300 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">{info.fullName || 'Your Name'}</h1>
        {info.jobTitle && <p className="text-[13px] text-slate-600 mt-0.5">{info.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 mt-2 text-[11px] text-slate-500">
          {info.email    && <span>{info.email}</span>}
          {info.phone    && <span>{info.phone}</span>}
          {info.city     && <span>{info.city}{info.state ? `, ${info.state}` : ''}</span>}
          {info.linkedIn && <span>{stripUrl(info.linkedIn)}</span>}
          {info.github   && <span>{stripUrl(info.github)}</span>}
          {info.website  && <span>{stripUrl(info.website)}</span>}
        </div>
      </header>

      {skills.length > 0 && (
        <Section title="Skills">
          <p className="text-slate-700">
            {skills.map((s: any) => typeof s === 'string' ? s : `${s.name}${s.level ? ` (${s.level})` : ''}`).join(' · ')}
          </p>
        </Section>
      )}

      {summary && (
        <Section title="Professional Summary">
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-[12.5px] text-slate-900">{exp.position}</strong>
                  <span className="text-[11px] text-slate-500 shrink-0 ml-2">{dateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div className="text-[11.5px] text-slate-600 italic">{exp.company}</div>
                <p className="mt-1 text-slate-700 leading-relaxed">{stripMd(exp.description ?? '')}</p>
                {exp.technologies?.length > 0 && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold not-italic text-slate-600">Technologies: </span>
                    {exp.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {projects.map((p: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-slate-900">{p.name}</strong>
                  {p.link && <span className="text-[11px] text-slate-500 ml-2">{stripUrl(p.link)}</span>}
                </div>
                <p className="mt-0.5 text-slate-700 leading-relaxed">{stripMd(p.description ?? '')}</p>
                {p.technologies?.length > 0 && (
                  <p className="mt-0.5 text-[11px] text-slate-500">{p.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-slate-900">{edu.school}</strong>
                  <span className="text-[11px] text-slate-500 ml-2">{dateRange(edu.startDate, edu.endDate, edu.isCurrent)}</span>
                </div>
                <div className="text-slate-600 italic">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                {edu.description && <p className="mt-0.5 text-slate-600">{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-2">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline">
                <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
                {cert.date && <span className="text-[11px] text-slate-500 ml-2">{fmtDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Layout: Modern ──────────────────────────────────────────────────────────

function ModernLayout({ resume }: { resume: any }) {
  const { info, summary, skills, experience, projects, education, certifications } = useResumeData(resume);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-px flex-1 bg-slate-200" />
        <h2 className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-slate-500">{title}</h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {children}
    </section>
  );

  return (
    <div className="font-sans text-[12px] leading-[1.55] text-slate-800 space-y-5">
      <header className="pb-4">
        <h1 className="text-[24px] font-bold tracking-tight text-slate-900 leading-none">{info.fullName || 'Your Name'}</h1>
        {info.jobTitle && <p className="text-[13px] text-slate-500 mt-1 font-medium">{info.jobTitle}</p>}
        <div className="mt-3 h-[3px] w-12 bg-slate-900 rounded-full" />
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-[11px] text-slate-500">
          {info.email    && <span>✉ {info.email}</span>}
          {info.phone    && <span>☎ {info.phone}</span>}
          {info.city     && <span>📍 {info.city}{info.state ? `, ${info.state}` : ''}</span>}
          {info.linkedIn && <span>🔗 {stripUrl(info.linkedIn)}</span>}
          {info.github   && <span>⚡ {stripUrl(info.github)}</span>}
          {info.website  && <span>🌐 {stripUrl(info.website)}</span>}
        </div>
      </header>

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s: any, i: number) => (
              <span key={i} className="border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-700 bg-slate-50">
                {typeof s === 'string' ? s : `${s.name}${s.level ? ` · ${s.level}` : ''}`}
              </span>
            ))}
          </div>
        </Section>
      )}

      {summary && (
        <Section title="Summary">
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="pl-3 border-l-2 border-slate-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900 text-[12.5px]">{exp.position}</span>
                  <span className="text-[11px] text-slate-400 ml-2 shrink-0">{dateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div className="text-[11.5px] text-slate-500 font-medium">{exp.company}</div>
                <p className="mt-1 text-slate-700 leading-relaxed">{stripMd(exp.description ?? '')}</p>
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {exp.technologies.map((t: string) => (
                      <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {projects.map((p: any, i: number) => (
              <div key={i} className="pl-3 border-l-2 border-slate-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  {p.link && <span className="text-[11px] text-slate-400 ml-2">{stripUrl(p.link)}</span>}
                </div>
                <p className="mt-0.5 text-slate-700 leading-relaxed">{stripMd(p.description ?? '')}</p>
                {p.technologies?.length > 0 && (
                  <p className="mt-1 text-[10.5px] text-slate-500">{p.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">{edu.school}</span>
                  <span className="text-[11px] text-slate-400 ml-2">{dateRange(edu.startDate, edu.endDate, edu.isCurrent)}</span>
                </div>
                <div className="text-[11.5px] text-slate-500">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                {edu.description && <p className="mt-0.5 text-slate-600">{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert: any, i: number) => (
            <div key={i} className="flex justify-between items-baseline py-0.5">
              <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
              {cert.date && <span className="text-[11px] text-slate-400 ml-2">{fmtDate(cert.date)}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

// ─── Layout: Compact ─────────────────────────────────────────────────────────

function CompactLayout({ resume }: { resume: any }) {
  const { info, summary, skills, experience, projects, education, certifications } = useResumeData(resume);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-3">
      <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white bg-slate-800 px-1.5 py-0.5 mb-2 inline-block">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="font-sans text-[11px] leading-[1.45] text-slate-800">
      <header className="mb-3 pb-2 border-b-2 border-slate-800">
        <h1 className="text-[20px] font-bold text-slate-900 tracking-tight leading-none">{info.fullName || 'Your Name'}</h1>
        {info.jobTitle && <p className="text-[11.5px] text-slate-600 font-medium mt-0.5">{info.jobTitle}</p>}
        <p className="text-[10.5px] text-slate-500 mt-1">
          {[info.email, info.phone,
            info.city && `${info.city}${info.state ? `, ${info.state}` : ''}`,
            info.linkedIn && stripUrl(info.linkedIn),
            info.github   && stripUrl(info.github),
          ].filter(Boolean).join('  |  ')}
        </p>
      </header>

      {skills.length > 0 && (
        <Section title="Technical Skills">
          <p className="text-slate-700">
            {skills.map((s: any) => typeof s === 'string' ? s : `${s.name}${s.level ? ` (${s.level})` : ''}`).join('  ·  ')}
          </p>
        </Section>
      )}

      {summary && (
        <Section title="Summary">
          <p className="text-slate-700">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-2.5">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">{exp.position}, <span className="font-normal text-slate-700">{exp.company}</span></span>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">{dateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <p className="text-slate-700 mt-0.5">{stripMd(exp.description ?? '')}</p>
                {exp.technologies?.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{exp.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-2">
            {projects.map((p: any, i: number) => (
              <div key={i}>
                <span className="font-bold text-slate-900">{p.name}</span>
                {p.link && <span className="text-[10px] text-slate-400 ml-1.5">{stripUrl(p.link)}</span>}
                <p className="text-slate-700 mt-0.5">{stripMd(p.description ?? '')}</p>
                {p.technologies?.length > 0 && (
                  <p className="text-[10px] text-slate-500">{p.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-2">
            {education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900">{edu.school}</span>
                  <span className="text-slate-600"> · {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                  {edu.description && <p className="text-slate-500 mt-0.5">{edu.description}</p>}
                </div>
                <span className="text-[10px] text-slate-500 ml-2 shrink-0">{dateRange(edu.startDate, edu.endDate, edu.isCurrent)}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-1">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
                {cert.date && <span className="text-[10px] text-slate-500 ml-2">{fmtDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Layout: Sidebar ─────────────────────────────────────────────────────────

function SidebarLayout({ resume }: { resume: any }) {
  const { info, summary, skills, experience, projects, education, certifications } = useResumeData(resume);

  const SideSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-4">
      <h2 className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">{title}</h2>
      {children}
    </section>
  );

  const MainSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-800 border-b border-slate-200 pb-1 mb-3">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="font-sans text-[11.5px] leading-[1.5] text-slate-800">
      <header className="mb-4 pb-4 border-b-2 border-slate-900">
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">{info.fullName || 'Your Name'}</h1>
        {info.jobTitle && <p className="text-[13px] text-slate-500 mt-0.5 font-medium">{info.jobTitle}</p>}
      </header>

      <div className="flex gap-6">
        <aside className="w-[32%] shrink-0 space-y-4">
          <SideSection title="Contact">
            <div className="space-y-1 text-[10.5px] text-slate-600">
              {info.email    && <p>{info.email}</p>}
              {info.phone    && <p>{info.phone}</p>}
              {info.city     && <p>{info.city}{info.state ? `, ${info.state}` : ''}</p>}
              {info.linkedIn && <p>{stripUrl(info.linkedIn)}</p>}
              {info.github   && <p>{stripUrl(info.github)}</p>}
              {info.website  && <p>{stripUrl(info.website)}</p>}
            </div>
          </SideSection>

          {skills.length > 0 && (
            <SideSection title="Skills">
              <div className="space-y-1">
                {skills.map((s: any, i: number) => {
                  const skillName  = typeof s === 'string' ? s : s.name;
                  const skillLevel = typeof s === 'object' && s.level ? s.level : null;
                  return (
                    <div key={i} className="flex justify-between items-baseline">
                      <span className="text-slate-700">{skillName}</span>
                      {skillLevel && <span className="text-[9.5px] text-slate-400">{skillLevel}</span>}
                    </div>
                  );
                })}
              </div>
            </SideSection>
          )}

          {education.length > 0 && (
            <SideSection title="Education">
              <div className="space-y-3">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="font-semibold text-slate-800">{edu.school}</p>
                    <p className="text-[10.5px] text-slate-500">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</p>
                    <p className="text-[10px] text-slate-400">{dateRange(edu.startDate, edu.endDate, edu.isCurrent)}</p>
                  </div>
                ))}
              </div>
            </SideSection>
          )}

          {certifications.length > 0 && (
            <SideSection title="Certifications">
              <div className="space-y-2">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <p className="font-semibold text-slate-800 text-[10.5px]">{cert.name}</p>
                    <p className="text-[10px] text-slate-400">{cert.issuer}{cert.date ? ` · ${fmtDate(cert.date)}` : ''}</p>
                  </div>
                ))}
              </div>
            </SideSection>
          )}
        </aside>

        <main className="flex-1 min-w-0">
          {summary && (
            <MainSection title="Summary">
              <p className="text-slate-700 leading-relaxed">{summary}</p>
            </MainSection>
          )}
          {experience.length > 0 && (
            <MainSection title="Experience">
              <div className="space-y-4">
                {experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{exp.position}</span>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0">{dateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{exp.company}</div>
                    <p className="mt-1 text-slate-700 leading-relaxed">{stripMd(exp.description ?? '')}</p>
                    {exp.technologies?.length > 0 && (
                      <p className="mt-1 text-[10px] text-slate-500">{exp.technologies.join(' · ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </MainSection>
          )}
          {projects.length > 0 && (
            <MainSection title="Projects">
              <div className="space-y-3">
                {projects.map((p: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      {p.link && <span className="text-[10px] text-slate-400 ml-2">{stripUrl(p.link)}</span>}
                    </div>
                    <p className="mt-0.5 text-slate-700 leading-relaxed">{stripMd(p.description ?? '')}</p>
                    {p.technologies?.length > 0 && (
                      <p className="mt-0.5 text-[10px] text-slate-500">{p.technologies.join(' · ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </MainSection>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Layout renderer ──────────────────────────────────────────────────────────

function ResumeContent({ resume, layout }: { resume: any; layout: LayoutId }) {
  switch (layout) {
    case 'classic': return <ClassicLayout resume={resume} />;
    case 'modern':  return <ModernLayout resume={resume} />;
    case 'compact': return <CompactLayout resume={resume} />;
    case 'sidebar': return <SidebarLayout resume={resume} />;
  }
}

// ─── Layout picker ────────────────────────────────────────────────────────────

function LayoutPicker({ current, onChange }: { current: LayoutId; onChange: (l: LayoutId) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {(Object.values(LAYOUTS) as LayoutConfig[]).map((cfg) => {
        const active = current === cfg.id;
        return (
          <button
            key={cfg.id}
            onClick={() => onChange(cfg.id)}
            className={`relative flex flex-col items-start gap-1 rounded-xl border px-3.5 py-3 text-left transition-all ${
              active
                ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {active && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <Check className="h-2.5 w-2.5 text-slate-900" />
              </span>
            )}
            <span className={active ? 'text-white' : 'text-slate-500'}>{cfg.icon}</span>
            <span className="text-sm font-semibold">{cfg.name}</span>
            <span className={`text-[11px] leading-tight ${active ? 'text-slate-300' : 'text-slate-400'}`}>
              {cfg.description}
            </span>
            <span className={`mt-1 text-[10px] font-semibold ${
              cfg.atsScore >= 95
                ? active ? 'text-emerald-300' : 'text-emerald-600'
                : active ? 'text-amber-300'   : 'text-amber-600'
            }`}>
              ATS {cfg.atsScore}%
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Pure client-side PDF download ───────────────────────────────────────────
// Uses html2canvas (screenshot the DOM) + jsPDF (pack into PDF).
// Both libs are lazy-loaded from CDN on first click — zero bundle cost.
// No server, no API route, no Puppeteer needed.

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s   = document.createElement('script');
    s.src     = src;
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function useDownloadPDF(ref: React.RefObject<HTMLDivElement | null>, fileName: string) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const download = useCallback(async () => {
    if (!ref.current) return;
    setDownloading(true);
    setError(null);

    try {
      // 2. Screenshot the resume div at 2× scale for crisp text
      const canvas = await html2canvas(ref.current, {
  scale: 2,
  backgroundColor: "#ffffff",
});

      // 3. Create A4 PDF and fit the screenshot to the page width
      const pdf    = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageW  = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH  = pdf.internal.pageSize.getHeight();  // 297 mm
      const margin = 10; // mm on each side
      const usableW = pageW - margin * 2;

      // px → mm conversion at 96 dpi (browser default)
      const pxToMm  = 25.4 / 96;
      const imgWmm  = (canvas.width  / 2) * pxToMm;   // /2 because we used scale:2
      const imgHmm  = (canvas.height / 2) * pxToMm;
      const scale   = usableW / imgWmm;
      const scaledH = imgHmm * scale;
      const usableH = pageH - margin * 2;

      // 4. Split across pages if the resume is taller than one A4 page
      const totalPages = Math.ceil(scaledH / usableH);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        // Slice the canvas for this page
        const srcY      = page * (usableH / scale / pxToMm) * (96 / 25.4) * 2; // back to canvas px
        const sliceHpx  = Math.min((usableH / scale / pxToMm) * (96 / 25.4) * 2, canvas.height - srcY);

        const slice       = document.createElement('canvas');
        slice.width       = canvas.width;
        slice.height      = Math.max(1, Math.round(sliceHpx));
        slice.getContext('2d')!.drawImage(canvas, 0, srcY, canvas.width, slice.height, 0, 0, canvas.width, slice.height);

        const sliceHmm  = (slice.height / 2) * pxToMm * scale;
        pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, usableW, sliceHmm);
      }

      // 5. Trigger download — no server involved
      pdf.save(`${fileName.replace(/\s+/g, '_') || 'resume'}.pdf`);

    } catch (err) {
      console.error('[PDF]', err);
      setError('Could not generate PDF. Try Ctrl+P → Save as PDF instead.');
    } finally {
      setDownloading(false);
    }
  }, [ref, fileName]);

  return { download, downloading, error };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PreviewPage() {
  const params   = useParams();
  const router   = useRouter();
  const resumeId = params.resumeId as string;
  const { resume, isLoading } = useResume(resumeId);
  const printRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LayoutId>('modern');

  const fileName = resume?.personalInfo?.fullName ?? 'resume';
  const { download, downloading, error } = useDownloadPDF(printRef, fileName);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
          <span className="text-sm">Loading preview…</span>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 text-sm">
        Resume not found
      </div>
    );
  }

  return (
    <StepGuard resumeId={resumeId}>
      <div className="space-y-6">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 no-print">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Preview</h2>
            <p className="text-sm text-slate-500 mt-0.5">Choose a layout, then download your resume as a PDF.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => router.push(`/resume/${resumeId}/personal-info`)}>
              <FileText className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4"
              onClick={download}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <div className="h-3.5 w-3.5 mr-1.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 2v8m0 0L5 7m3 3l3-3M2 12h12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="no-print flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <svg className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            {error}
          </div>
        )}

        {/* Layout picker */}
        <div className="no-print">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Layout</p>
          <LayoutPicker current={layout} onChange={setLayout} />
          {layout === 'sidebar' && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              Two-column layouts may score lower on some ATS parsers. Use Classic, Modern, or Compact for best compatibility.
            </p>
          )}
        </div>

        {/* ATS badge */}
        <div className="no-print flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-emerald-800">
            <strong>ATS-friendly</strong> — plain text only, standard section headings, no tables or graphics in parsed content.
          </span>
        </div>

        {/* Resume paper */}
        <div
          ref={printRef}
          id="resume-paper"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 max-w-[794px] mx-auto print:shadow-none print:border-none print:rounded-none print:p-0"
        >
          <ResumeContent resume={resume} layout={layout} />
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between no-print">
          <Button variant="outline" onClick={() => router.push(`/resume/${resumeId}/summary`)}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={download} disabled={downloading}>
            {downloading ? 'Generating PDF…' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </StepGuard>
  );
}