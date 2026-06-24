export interface GenerateSummary {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface GenerateSkills {
  experienceLevel: string;
  jobTitle: string;
}

export interface GenerateDescription {
  experienceLevel: string;
  jobTitle: string;
  techStack: string[];
}

export interface GenerateExperienceDescription {
  experienceLevel: string;
  numberOfYears: number;
  techStack: string[];
  jobRole: string;
}

export interface ImproveContent {
  content: string;
}

export interface ATSScore {
  resumeText: string;
}