// lib/gemini-analyzer.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function analyzeVideoForClips(youtubeUrl: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    Analyze this YouTube video: ${youtubeUrl}
    
    Please identify the 10 most engaging moments that would make great short-form clips for TikTok, Instagram Reels, and YouTube Shorts.
    
    For each clip, provide:
    1. Start timestamp (in seconds)
    2. End timestamp (in seconds)
    3. Title/description of the moment
    4. Why it's engaging (hook, value, emotion)
    5. Viral score (0-100)
    
    Return the response as a JSON array with this structure:
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
    
    Focus on:
    - Strong hooks in the first 3 seconds
    - Complete thoughts (don't cut mid-sentence)
    - Emotional peaks or valuable insights
    - Clips between 15-60 seconds
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Parse JSON from response
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse AI response");
}
