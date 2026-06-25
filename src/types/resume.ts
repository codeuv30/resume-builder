export interface PersonalInfo {
  _id?: string;
  fullName?: string;      // was: fullname
  email?: string;
  phone?: string;           // was: mobile
  jobTitle?: string;        // ADDED
  address?: string;         // was: location
  city?: string;            // ADDED
  state?: string;           // ADDED
  zipCode?: string;         // ADDED
  linkedIn?: string;        // was: linkedin
  github?: string;
  portfolio?: string;
}

export interface Education {
  _id?: string;
  school: string;           // was: institute
  degree: string;
  fieldOfStudy: string;     // ADDED
  startDate: string;
  endDate: string;
  description: string;      // ADDED
  isCurrent: boolean;       // ADDED
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;          // was: endData (typo!)
  description: string;      // was: desription (typo!)
  isCurrent: boolean;       // ADDED
  technologies: string[];   // ADDED
}

export interface Project {
  _id?: string;
  name: string;             // was: title
  description: string;
  technologies: string[];   // was: tackStack (typo!)
  link: string;             // combines githubURL + liveURL
  startDate: string;        // ADDED
  endDate: string;          // ADDED
}

export interface Skill {
  _id?: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Achievement {
  _id?: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Resume {
  _id: string;
  user_id: string;
  title: string;
  summary: string;
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  certifications: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}