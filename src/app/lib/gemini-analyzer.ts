import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface MomentTimestamp {
  start: number;
  end: number;
  duration: number;
  description: string;
  score: number;
}

export interface MontageClip {
  clipNumber: number;
  title: string;
  targetDuration: number; // Target duration for final montage (e.g., 60s)
  moments: MomentTimestamp[];
  totalDuration: number;
  viralScore: number;
}

export async function analyzeVideoForMontages(
  youtubeUrl: string,
  numberOfClips: number = 10
): Promise<MontageClip[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analyze this YouTube video: ${youtubeUrl}
    
    Create ${numberOfClips} different short-form montage clips. Each montage should:
    - Combine 3-5 best moments from different parts of the video
    - Total duration: 45-60 seconds
    - Each moment: 8-20 seconds
    - Moments should flow well together thematically
    - Have smooth narrative progression
    
    Return ONLY a valid JSON array:
    [
      {
        "clipNumber": 1,
        "title": "Top Crypto Trading Strategies",
        "targetDuration": 60,
        "moments": [
          {
            "start": 120,
            "end": 135,
            "duration": 15,
            "description": "Hook: Trading mistake everyone makes",
            "score": 95
          },
          {
            "start": 340,
            "end": 355,
            "duration": 15,
            "description": "Strategy 1: Dollar cost averaging",
            "score": 92
          },
          {
            "start": 680,
            "end": 695,
            "duration": 15,
            "description": "Strategy 2: Risk management",
            "score": 90
          },
          {
            "start": 1020,
            "end": 1035,
            "duration": 15,
            "description": "Call to action",
            "score": 88
          }
        ],
        "totalDuration": 60,
        "viralScore": 94
      }
    ]
    
    Requirements:
    - First moment must be a strong hook
    - Middle moments provide value/entertainment
    - Last moment should have call-to-action or conclusion
    - Avoid mid-sentence cuts
    - Each montage should tell a complete mini-story
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse AI response");
}
