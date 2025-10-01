import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

interface ClipTimestamp {
  start: number;
  end: number;
  duration: number;
  title: string;
  reason: string;
  viralScore: number;
}

export async function analyzeVideoForClips(
  youtubeUrl: string
): Promise<ClipTimestamp[]> {
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analyze this YouTube video: ${youtubeUrl}
    
    Identify the 10 most engaging moments for TikTok/Instagram Reels/YouTube Shorts.
    
    Return ONLY a valid JSON array with this exact structure:
    [
      {
        "start": 45,
        "end": 75,
        "duration": 30,
        "title": "The Secret to Success",
        "reason": "Strong hook with actionable advice",
        "viralScore": 95
      }
    ]
    
    Requirements:
    - Clips between 15-60 seconds
    - Strong hooks in first 3 seconds
    - Complete thoughts (no mid-sentence cuts)
    - Emotional peaks or valuable insights
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Extract JSON from response
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse AI response");
}
