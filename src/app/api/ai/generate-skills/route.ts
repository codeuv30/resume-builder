import { generateAiResponse } from "@/lib/gemini";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

function parseSkills(raw: string): string[] {
  const cleaned = raw
    .replace(/^\[|\]$/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .trim();

  return cleaned
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context } = body; // e.g., "Senior React Developer with 5 years in fintech"

    if (!context) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Context is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a technical recruiter. Generate ONLY a raw comma-separated list of 8-15 technical skills for: ${context}

Rules:
- NO quotes, brackets, categories, or explanations
- NO soft skills (communication, leadership, etc.)
- ONLY technical skills: languages, frameworks, databases, cloud, DevOps, tools

Output format: TypeScript, React, Node.js, PostgreSQL, AWS, Docker
`;

    const rawSkills = await generateAiResponse(prompt);
    const skillsArray = parseSkills(rawSkills);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Skills generated",
        data: { skills: skillsArray },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in generate skills API", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error generating skills" },
      { status: 500 }
    );
  }
}