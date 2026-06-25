import { generateAiResponse } from "@/lib/gemini";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { position, company, technologies } = body;

    if (!position || !company) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Position and company are required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a senior technical recruiter. Write ONE professional work experience paragraph (50-80 words) for:

Position: ${position}
Company: ${company}
Technologies: ${technologies?.join(", ") || "various technologies"}

Rules:
- Start with strong action verb
- Include 1-2 quantifiable achievements
- Mention 3-5 technologies naturally
- NO first-person pronouns, NO bullet points, NO filler words
- Past tense only

Output ONLY the paragraph, nothing else.
`;

    const description = await generateAiResponse(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Description generated",
        data: { description },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in generate experience description API", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error generating description" },
      { status: 500 }
    );
  }
}