import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export async function transcribeAudio(
  audioPath: string
): Promise<WordTimestamp[]> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  // @ts-ignore - OpenAI SDK typing issue with words
  return transcription.words || [];
}
