import { Types } from "mongoose";

export interface IPersonalInfo {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endData: string;
  desription: string;
}

export interface IProjects {
  title: string;
  description: string;
  githubURL: string;
  liveURL: string;
  tackStack: string[];
}

export interface IEducation {
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface IResume {
  _id?: string;
  user_id: Types.ObjectId;
  title: string;
  summary: string;
  skills: string[];
  personalInfo: IPersonalInfo;
  workExperience?: IWorkExperience[];
  projects: IProjects[];
  education: IEducation[];
  certifications: string[];
  createdAt?: Date;
  updatedAt?: Date
}