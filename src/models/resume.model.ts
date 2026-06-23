import { IResume } from "@/types/resume.types";
import mongoose, { Types } from "mongoose";

const resumeSchema = new mongoose.Schema<IResume>({
  user_id: { type: Types.ObjectId, ref: "users" },
  title: { type: String, default: "" },
  summary: { type: String, default: "" },
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
});

const Resume = mongoose.model("resumes", resumeSchema);

export default Resume;
