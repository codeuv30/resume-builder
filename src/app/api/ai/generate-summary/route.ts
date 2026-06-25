import { generateAiResponse } from "@/lib/gemini";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context } = body; // e.g., job title + key skills + years

    if (!context) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Context is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert resume writer. Write ONE professional summary (50-80 words) for:

${context}

Rules:
- Strong action verbs, measurable impact
- ATS-optimized keywords
- NO first-person pronouns
- Single paragraph only

Output ONLY the summary.
`;

    const summary = await generateAiResponse(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Summary generated",
        data: { summary },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in generate summary API", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error generating summary" },
      { status: 500 }
    );
  }
}