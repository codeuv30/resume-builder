import { IResume } from "@/types/resume.types";
import mongoose, { Types } from "mongoose";

const resumeSchema = new mongoose.Schema<IResume>(
  {
    user_id: { type: Types.ObjectId, ref: "users", required: true },
    title: { type: String, default: "" },
    summary: { type: String, default: "" },
    personalInfo: {
      type: {
        fullname: String,
        email: String,
        mobile: String,
        location: String,
        github: String,
        linkedin: String,
        portfolio: String,
      },
      default: {},
    },
    education: {
      type: [
        {
          institute: String,
          degree: String,
          startDate: String,
          endDate: String,
        },
      ],
    },
    workExperience: {
      type: [
        {
          company: String,
          position: String,
          startDate: String,
          endData: String,
          desription: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          githubURL: String,
          liveURL: String,
          tackStack: String,
        },
      ],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Resume = mongoose.models.resumes || mongoose.model("resumes", resumeSchema);

export default Resume;
