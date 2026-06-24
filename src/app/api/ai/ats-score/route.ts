import { generateAiResponse } from "@/lib/gemini";
import { ATSScore } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ATSScore = await req.json();

    const { resumeText } = body;

    if (!resumeText) {
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
You are an expert Applicant Tracking System (ATS) analyzer and technical recruiter with deep knowledge of how modern ATS software (Workday, Greenhouse, Lever, Taleo) parses and ranks resumes.

[TASK]
Analyze the provided resume text and return ONLY a valid JSON object. No markdown, no code blocks, no explanations outside the JSON.

[INPUT]
Resume Text: ${resumeText}

[ANALYSIS CRITERIA]
1. Keyword Density (0-100): Presence of industry-specific technical and role-specific keywords
2. Formatting & Structure (0-100): ATS-parseability (no tables, no headers/footers, standard section labels)
3. Quantifiable Impact (0-100): Use of metrics, percentages, numbers in achievements
4. Action Verbs & Clarity (0-100): Strong verbs, concise phrasing, no filler
5. Section Completeness (0-100): Presence of Summary, Experience, Skills, Education, Projects
6. Grammar & Professional Tone (0-100): Error-free, professional language

[RULES — STRICT]
1. Output MUST be ONLY a valid JSON object. No markdown fences, no \`\`\`, no trailing commas.
2. overallScore must be a weighted average: (Keyword*0.25 + Formatting*0.15 + Impact*0.20 + Verbs*0.15 + Sections*0.15 + Grammar*0.10)
3. Each score must be an integer between 0 and 100.
4. missingKeywords must be an array of 5-10 relevant technical/role keywords NOT found in the resume.
5. suggestions must be an array of 3-5 specific, actionable improvements.
6. strengths must be an array of 2-3 things the resume does well.
7. Do NOT invent information not present in the resume.
8. If resume text is insufficient or garbled, return the JSON with scores of 0 and a note in suggestions.

[OUTPUT FORMAT — EXACT JSON SCHEMA]
{
  "overallScore": 72,
  "breakdown": {
    "keywordDensity": 65,
    "formattingStructure": 80,
    "quantifiableImpact": 45,
    "actionVerbsClarity": 70,
    "sectionCompleteness": 85,
    "grammarProfessionalTone": 90
  },
  "missingKeywords": ["Kubernetes", "CI/CD", "Microservices", "GraphQL", "AWS Lambda"],
  "suggestions": [
    "Add measurable outcomes to work experience (e.g., reduced load time by 30%)",
    "Include missing cloud technologies like AWS or Azure in skills section",
    "Replace passive language with strong action verbs like Architected, Engineered, Optimized"
  ],
  "strengths": [
    "Clean section structure with clear headers",
    "Strong technical skills coverage in backend technologies"
  ]
}
    `;

    const result = await generateAiResponse(prompt);

    const ATSScore = result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Successfully calculated ATS Score",
        data: { ATSScore },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error in ATS Score api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error while calculated ATS Score",
      },
      { status: 400 },
    );
  }
}
