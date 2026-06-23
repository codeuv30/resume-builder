import { generateAiResponse } from "@/lib/gemini";
import { GenerateSummary, ImproveContent } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContent = await req.json();

    const { content } = body;

    if (!content) {
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
You are an expert ATS resume optimizer and technical editor.

[TASK]
Rewrite the provided resume content to be more ATS-friendly, impactful, and professional. Return ONLY the improved content. No explanations, no before/after labels, no markdown.

[INPUT]
Original Content: ${content}

[RULES — STRICT]
1. Preserve the original meaning and intent. Do NOT invent new technologies, job titles, or metrics not implied in the original.
2. Use strong action verbs and industry-specific keywords naturally.
3. Add or enhance 1 quantifiable outcome if the original implies impact but lacks numbers (e.g., "improved speed" → "improved speed by 40%"). If no impact is implied, do not invent metrics.
4. Remove filler words, buzzwords, and generic soft skills (e.g., "team player," "hardworking," "fast-paced environment").
5. Ensure every line is scannable and keyword-dense for ATS parsing.
6. Keep the output length within ±20% of the original word count. Do not expand into a novel.
7. NO first-person pronouns (I, me, my, we, our).
8. NO bullet points unless the original was already a list — if so, preserve the list format.
9. NO markdown headers, bold, italics, or code blocks.
10. Output ONLY the rewritten content. Do not wrap in quotes or add intro/outro text.

[OUTPUT FORMAT]
Return exactly the improved content in plain text, matching the structure of the input.
`;

    const result = await generateAiResponse(prompt);

    const improvedContent = result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Improved Content created",
        data: { improvedContent },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error in generate Improved Content api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error while creating Improved Content",
      },
      { status: 400 },
    );
  }
}
