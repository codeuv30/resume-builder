import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import Resume from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> },
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const { resumeId } = await params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user_id: userId,
    });

    console.log("RESUME", resume);
    console.log("USER_ID", userId);
    console.log("RESUME_ID", resumeId);

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume does not exists",
        },
        { status: 400 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Successfully fetched Resume",
        data: resume,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error in get resume api", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message || "Error occured while fetching your resume",
        error: { error },
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> },
) {
  try {
    const body = await req.json();
    await connectToDB();
    const userId = await getCurrentUser();
    const { resumeId } = await params;

    // Build $set with dot notation to merge nested objects instead of replacing
    const setObject: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(body)) {
      if (key === 'personalInfo' && typeof value === 'object' && value !== null) {
        // Merge personalInfo fields individually
        for (const [subKey, subValue] of Object.entries(value)) {
          setObject[`personalInfo.${subKey}`] = subValue;
        }
      } else if (Array.isArray(value)) {
        // For arrays (education, skills, etc.), replace entirely
        setObject[key] = value;
      } else {
        setObject[key] = value;
      }
    }

    console.log('PATCH body received:', body);
    console.log('PATCH setObject:', setObject);

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, user_id: userId },
      { $set: setObject },
      { new: true, runValidators: true }
    );

    console.log('PATCH updated personalInfo:', updatedResume?.personalInfo);

    if (!updatedResume) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Resume does not exist" },
        { status: 400 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Successfully updated your resume.",
        data: updatedResume,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error in patch resume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message || "Error occurred while updating your resume",
        error: { error },
      },
      { status: 500 },
    );
  }
}