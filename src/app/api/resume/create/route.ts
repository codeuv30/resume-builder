import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import Resume from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const newResume = await Resume.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            certifications: [],
            skills: []
        });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume created successfully",
            data: newResume
        }, { status: 201 });
    } catch (error) {
        console.log("error in create resume api", error)
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Error while creating your resume",
        }, { status: 400 });
    }
}