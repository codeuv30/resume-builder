import { generateAiResponse } from "@/lib/gemini";
import { GenerateSkills } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

function parseSkills(raw: string): string[] {
  // Remove JSON array brackets, quotes, and extra whitespace
  const cleaned = raw
    .replace(/^\[|\]$/g, "") // remove [ ] wrappers
    .replace(/"/g, "") // remove all quotes
    .replace(/'/g, "") // remove single quotes
    .trim();

  return cleaned
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSkills = await req.json();

    const { experienceLevel, jobTitle } = body;

    if (!experienceLevel || !jobTitle) {
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
You are a technical recruiter and ATS optimization expert.

[TASK]
Generate ONLY a raw comma-separated list of technical skills. No quotes, no brackets, no categories, no explanations, no headers, no soft skills.

[INPUT]
- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}

[RULES — STRICT]
1. Output MUST be ONLY raw comma-separated values: skill1, skill2, skill3
2. NO quotation marks around individual skills.
3. NO square brackets, curly braces, or JSON array syntax.
4. NO soft skills (e.g., communication, leadership, teamwork, problem-solving).
5. NO categories, groupings, labels, or markdown formatting.
6. Include 8-15 technical skills maximum.
7. Prioritize: programming languages, frameworks, libraries, databases, cloud platforms, DevOps tools, APIs, version control, testing tools, and relevant software.
8. Match skills to the Job Title and Experience Level.
9. If Existing Skills are provided, include them plus 3-5 complementary technical skills.
10. Do not output bullet points, numbers, or any text outside the comma-separated list.
11. If input is insufficient, infer reasonable technical defaults for the job title.

[OUTPUT FORMAT — EXACT]
TypeScript, Node.js, React, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, REST APIs, Git, CI/CD, Python, Terraform
    `;

    const rawSkills = await generateAiResponse(prompt);

    if (!rawSkills) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "AI returned empty response",
        },
        { status: 502 },
      );
    }

    const skillsArray = parseSkills(rawSkills);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Skills created",
        data: { skills: skillsArray },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error in generate skills api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error while creating skills",
      },
      { status: 400 },
    );
  }
}
