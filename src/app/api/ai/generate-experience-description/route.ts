import { generateAiResponse } from "@/lib/gemini";
import { GenerateDescription, GenerateExperienceDescription, GenerateSkills } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperienceDescription = await req.json();

    const { experienceLevel, numberOfYears, techStack, jobRole } = body;

    if (!experienceLevel || !numberOfYears || !techStack || !jobRole) {
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
You are a senior technical recruiter and ATS optimization expert who writes compelling work experience descriptions.

[TASK]
Generate ONLY a single professional work experience description paragraph. No headings, no bullet points, no sections, no labels, no explanations.

[INPUT]
- Job Role: ${jobRole}
- Experience Level: ${experienceLevel}
- Number of Years: ${numberOfYears}
- Tech Stack Used: ${techStack}

[RULES — STRICT]
1. Output MUST be exactly ONE paragraph between 50 and 80 words.
2. Start with a strong action verb describing core responsibilities and impact.
3. Mention 3-5 technologies from the Tech Stack naturally within the text.
4. Include 1-2 quantifiable achievements or measurable outcomes (e.g., improved performance by X%, reduced load time, scaled to Y users, increased revenue by Z%).
5. Infer realistic responsibilities based on Job Role, Experience Level, and Number of Years:
   - Entry (0-2 years): assisted in development, implemented features, fixed bugs, wrote unit tests, learned best practices
   - Mid-Level (2-5 years): owned modules, integrated third-party APIs, optimized code performance, collaborated cross-functionally, mentored juniors
   - Senior (5-8 years): led architecture decisions, designed scalable systems, mentored team members, drove technical strategy, owned end-to-end delivery
   - Lead/Principal (8+ years): scaled systems to millions of users, established engineering standards, managed stakeholder alignment, led multiple teams, influenced product roadmap
6. The Number of Years must subtly influence the depth and scope of achievements described.
7. NO first-person pronouns (I, me, my, we, our).
8. NO bullet points, numbered lists, or markdown formatting.
9. NO generic filler like "cutting-edge," "fast-paced environment," "dynamic team," "leveraged modern tools."
10. Write in past tense.
11. Do not output any text outside the single paragraph description.

[OUTPUT FORMAT — EXACT]
Developed and maintained scalable REST APIs and microservices using Node.js, PostgreSQL, and Docker, processing 2M+ daily requests with 99.95% uptime while reducing infrastructure costs by 25% through optimized caching strategies with Redis and AWS CloudFront.
    `;
    const workExperienceDescription = await generateAiResponse(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Description created",
        data: { workExperienceDescription },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("error in generate work experience description api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error while generating work experience",
      },
      { status: 400 },
    );
  }
}
