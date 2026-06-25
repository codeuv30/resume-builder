import { IResume } from "@/types/resume.types";
import mongoose, { Types, Schema } from "mongoose";

// Define personal info as a separate schema for proper typing
const personalInfoSchema = new Schema({
  fullName: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  linkedIn: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
}, { _id: true });  // _id: true gives it an ObjectId

const educationSchema = new Schema({
  school: { type: String, default: "" },
  degree: { type: String, default: "" },
  fieldOfStudy: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  description: { type: String, default: "" },
  isCurrent: { type: Boolean, default: false },
}, { _id: true });

const workExperienceSchema = new Schema({
  company: { type: String, default: "" },
  position: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  description: { type: String, default: "" },
  isCurrent: { type: Boolean, default: false },
  technologies: [{ type: String }],
}, { _id: true });

const projectSchema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  technologies: [{ type: String }],
  link: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
}, { _id: true });

const skillSchema = new Schema({
  name: { type: String, default: "" },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Intermediate",
  },
}, { _id: true });

const certificationSchema = new Schema({
  name: { type: String, default: "" },
  issuer: { type: String, default: "" },
  date: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: true });

const resumeSchema = new mongoose.Schema<IResume>(
  {
    user_id: { type: Types.ObjectId, ref: "users", required: true },
    title: { type: String, default: "" },
    summary: { type: String, default: "" },
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    education: { type: [educationSchema], default: [] },
    workExperience: { type: [workExperienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
  },
  { timestamps: true },
);

const Resume =
  mongoose.models.resumes || mongoose.model("resumes", resumeSchema);

export default Resume;