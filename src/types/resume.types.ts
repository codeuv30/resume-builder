import { Types } from "mongoose";

export interface IPersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  address?: string;      // was: location
  city?: string;         // ADDED
  state?: string;        // ADDED
  zipCode?: string;      // ADDED
  github?: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface IWorkExperience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;      // was: endData (typo!)
  description?: string;    // was: desription (typo!)
  isCurrent?: boolean;   // ADDED
  technologies?: string[]; // ADDED
}

export interface IProjects {
  name?: string;         // was: title
  description?: string;
  technologies?: string[]; // was: tackStack (typo!)
  link?: string;         // combines githubURL + liveURL
  startDate?: string;    // ADDED
  endDate?: string;      // ADDED
}

export interface IEducation {
  school?: string;       // was: institute
  degree?: string;
  fieldOfStudy?: string;   // ADDED
  startDate?: string;
  endDate?: string;
  description?: string;  // ADDED
  isCurrent?: boolean;   // ADDED
}

export interface ICertification {
  name?: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface ISkill {
  name?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface IResume {
  _id?: string;
  user_id: Types.ObjectId;
  title?: string;
  summary?: string;
  skills?: ISkill[];           // was: string[]
  personalInfo?: IPersonalInfo;
  workExperience?: IWorkExperience[];
  projects?: IProjects[];
  education?: IEducation[];
  certifications?: ICertification[];  // was: string[]
  createdAt?: Date;
  updatedAt?: Date;
}