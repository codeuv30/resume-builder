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

    const updatedResume = await Resume.findOneAndUpdate({
        _id: resumeId,
        user_id: userId
    }, {
        $set: body
    }, { new: true, runValidators: true });

    if (!updatedResume) {
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
        message: "Successfully made changes to your resume.",
        data: updatedResume,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error in patch resume api", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message:  error.message || "Error occured while making changes into your resume",
        error: { error },
      },
      { status: 500 },
    );
  }
}
