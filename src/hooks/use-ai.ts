'use client';

import { useState } from 'react';
import {
  generateSkills,
  generateExperienceDescription,
  generateProjectDescription,
  generateSummary,
} from '@/lib/api/ai';

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSkillsAI = async (context: string): Promise<string[]> => {
    setIsGenerating(true);
    try {
      const response = await generateSkills(context);
      return response.data.data.skills;
    } catch {
      await new Promise(r => setTimeout(r, 800));
      return ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS'];
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProjectDescriptionAI = async (
    projectName: string,
    technologies: string[]
  ): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await generateProjectDescription(projectName, technologies);
      return response.data.data.description;
    } catch {
      await new Promise(r => setTimeout(r, 800));
      return `Developed ${projectName} using ${technologies.join(', ')}. Implemented scalable architecture and optimized performance for production workloads.`;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExperienceDescriptionAI = async (
    position: string,
    company: string,
    technologies: string[]
  ): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await generateExperienceDescription(position, company, technologies);
      return response.data.data.description;
    } catch {
      await new Promise(r => setTimeout(r, 800));
      return `Served as ${position} at ${company}, leveraging ${technologies.join(', ')} to deliver high-impact solutions. Led feature development and optimized system performance.`;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSummaryAI = async (context: string): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await generateSummary(context);
      return response.data.data.summary;
    } catch {
      await new Promise(r => setTimeout(r, 800));
      return `Results-driven professional with expertise in ${context}. Proven track record of delivering scalable solutions and optimizing performance.`;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSkills: generateSkillsAI,
    generateProjectDescription: generateProjectDescriptionAI,
    generateExperienceDescription: generateExperienceDescriptionAI,
    generateSummary: generateSummaryAI,
    isGenerating,
  };
}