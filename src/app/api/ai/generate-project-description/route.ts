import { generateAiResponse } from "@/lib/gemini";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName, technologies } = body;

    if (!projectName) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project name is required" },
        { status: 400 },
      );
    }

    const prompt = `
You are a senior developer. Write ONE professional project description paragraph (40-60 words) for:

Project: ${projectName}
Technologies: ${technologies?.join(", ") || "various technologies"}

Rules:
- Describe technical implementation and impact
- Include 1 quantifiable outcome
- Mention key technologies naturally
- NO first-person pronouns, NO bullet points
- Past tense

Output ONLY the paragraph.
`;

    const description = await generateAiResponse(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Description generated",
        data: { description },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in generate project description API", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error generating description" },
      { status: 500 },
    );
  }
}
