import { generateAiResponse } from "@/lib/gemini";
import { GenerateDescription, GenerateSkills } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateDescription = await req.json();

    const { experienceLevel, jobTitle, techStack } = body;

    if (!experienceLevel || !jobTitle || !techStack) {
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
You are a senior technical writer specializing in ATS-optimized project descriptions for software engineers.

[TASK]
Generate ONLY a single professional project description paragraph. No headings, no bullet points, no sections, no labels, no explanations.

[INPUT]
- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}
- Tech Stack Used: ${techStack}

[RULES — STRICT]
1. Output MUST be exactly ONE paragraph between 40 and 70 words.
2. Start with a strong action verb (Built, Architected, Developed, Engineered, Designed).
3. Mention 3-5 technologies from the Tech Stack naturally within the text.
4. Include 1 quantifiable outcome or measurable impact (e.g., improved performance by X%, reduced load time, scaled to Y users, cut costs by Z%).
5. Infer a realistic project scope based on the Job Title and Experience Level:
   - Entry: focused features, smaller scale, learning-oriented
   - Mid-Level: full module ownership, integration complexity
   - Senior/Lead: system design, scalability, architecture decisions, mentoring
6. NO first-person pronouns (I, me, my, we, our).
7. NO bullet points, numbered lists, or markdown formatting.
8. NO generic filler like "cutting-edge," "fast-paced environment," "leveraged modern tools."
9. Write in past tense.
10. Do not output any text outside the single paragraph description.

[OUTPUT FORMAT — EXACT]
Architected a microservices-based order processing system using Node.js, Kafka, and PostgreSQL, handling 50K daily transactions with 99.9% uptime and reducing payment failure rate by 35% through idempotent webhook design and circuit breaker patterns.
    `;
    const projectDescription = await generateAiResponse(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Description created",
        data: { projectDescription },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error in generate description api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error while generating description",
      },
      { status: 400 },
    );
  }
}
