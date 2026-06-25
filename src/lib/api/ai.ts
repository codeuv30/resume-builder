import api from '../api';

export const generateSkills = (context: string) =>
  api.post('/ai/generate-skills', { context });

export const generateExperienceDescription = (position: string, company: string, technologies: string[]) =>
  api.post('/ai/generate-experience-description', { position, company, technologies });

export const generateProjectDescription = (projectName: string, technologies: string[]) =>
  api.post('/ai/generate-project-description', { projectName, technologies });

export const generateSummary = (context: string) =>
  api.post('/ai/generate-summary', { context });

export const improveContent = (content: string) =>
  api.post('/ai/improve-content', { content });

export const getATSScore = (resumeText: string) =>
  api.post('/ai/ats-score', { resumeText });