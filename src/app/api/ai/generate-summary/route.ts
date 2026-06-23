import { generateAiResponse } from "@/lib/gemini";
import { GenerateSummary } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const body: GenerateSummary = await req.json();

    const { experienceLevel, jobTitle, skills } = body;

    if (!experienceLevel || !jobTitle || !skills) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const prompt = `
[ROLE]
You are an expert resume writer specializing in ATS-optimized content.

[TASK]
Write ONLY a professional resume summary. Do not include any other sections, explanations, labels, or markdown formatting.

[INPUT]
- Job Title: ${jobTitle}
- Key Skills: ${skills}
- Experience Level: ${experienceLevel}

[RULES — STRICT]
1. Word count must be between 50 and 80 words. No exceptions.
2. Output must be a single paragraph.
3. Use strong action verbs and measurable impact where possible.
4. Include relevant keywords from the Job Title and Skills for ATS compatibility.
5. Do not use first-person pronouns (I, me, my).
6. No filler words, fluff, or generic soft skills.
7. Do not output bullet points, headers, or any text outside the summary itself.
8. If input is insufficient, infer reasonable professional defaults rather than asking questions.

[OUTPUT FORMAT]
Return exactly one plain-text paragraph. Nothing else.
    `;

    const result = await generateAiResponse(prompt);

    const summary = result;

    return NextResponse.json<ApiResponse>({
        success: true,
        message: "Summary created",
        data: { summary }
    } ,{ status: 201 });

  } catch (error) {
    console.log("error in generate summary api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error while creating summary",
      },
      { status: 400 },
    );
  }
}
