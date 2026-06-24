'use client';

import { useState } from 'react';
import api from '@/lib/api';

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSkills = async (context: string): Promise<string[]> => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/generate-skills', { context });
      return response.data.data.skills;
    } catch {
      // Mock fallback — replace with actual endpoint
      await new Promise(r => setTimeout(r, 1200));
      const mockSkills = [
        'React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS',
        'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'Git'
      ];
      return mockSkills.filter(() => Math.random() > 0.3);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProjectDescription = async (
    projectName: string, 
    technologies: string[]
  ): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/generate-project', { 
        projectName, 
        technologies 
      });
      return response.data.data.description;
    } catch {
      await new Promise(r => setTimeout(r, 1200));
      return `Developed ${projectName} utilizing ${technologies.join(', ')}. Architected scalable frontend and backend components, implemented real-time data synchronization, and optimized performance for production workloads. Collaborated with stakeholders to deliver features on schedule while maintaining high code quality standards.`;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExperienceDescription = async (
    position: string,
    company: string,
    technologies: string[]
  ): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/generate-experience', {
        position,
        company,
        technologies
      });
      return response.data.data.description;
    } catch {
      await new Promise(r => setTimeout(r, 1200));
      return `Served as ${position} at ${company}, driving development initiatives using ${technologies.join(', ')}. Led feature development from conception to deployment, mentored junior developers, and optimized application performance. Collaborated with cross-functional teams to deliver high-impact solutions that improved user engagement and system reliability.`;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSummary = async (context: string): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/generate-summary', { context });
      return response.data.data.summary;
    } catch {
      await new Promise(r => setTimeout(r, 1200));
      return `Results-driven software engineer with expertise in ${context}. Proven track record of building scalable web applications, optimizing system performance, and delivering high-quality code. Strong problem-solving abilities with a passion for clean architecture and modern development practices.`;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSkills,
    generateProjectDescription,
    generateExperienceDescription,
    generateSummary,
    isGenerating,
  };
}