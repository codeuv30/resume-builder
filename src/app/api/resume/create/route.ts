import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import Resume from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    let userId: string;
    try {
      userId = await getCurrentUser();
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const newResume = await Resume.create({
      user_id: userId,
      title: "",
      summary: "",
      personalInfo: {},
      workExperience: [],
      projects: [],
      education: [],
      certifications: [],
      skills: [],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume created successfully",
        data: newResume,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.log("error in create resume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message ||  "Error while creating your resume",
      },
      { status: 400 },
    );
  }
}
