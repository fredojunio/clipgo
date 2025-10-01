import path from "path";
import fs from "fs";
import { analyzeVideoForClips } from "./gemini-analyzer";
import { downloadYouTubeVideo } from "./yt-downloader";
import {
  cutVideoClip,
  cropToPortrait,
  extractAudio,
  embedCaptions,
  generateThumbnail,
} from "./ffmpeg-processor";
import { transcribeAudio } from "./speech-to-text";
import { generateSRT } from "./srt-generator";

export interface ProcessedClip {
  id: number;
  title: string;
  videoPath: string;
  thumbnailPath: string;
  duration: string;
  viralScore: number;
  timestamp: string;
}

export async function processYouTubeVideo(
  youtubeUrl: string,
  jobId: string
): Promise<ProcessedClip[]> {
  const workDir = path.join(process.cwd(), "public", "temp", jobId);
  fs.mkdirSync(workDir, { recursive: true });

  console.log(`[${jobId}] Starting video processing...`);

  try {
    // STEP 1: Download YouTube video
    console.log(`[${jobId}] Downloading video...`);
    const videoPath = await downloadYouTubeVideo(youtubeUrl, workDir);
    console.log(`[${jobId}] Video downloaded: ${videoPath}`);

    // STEP 2: Analyze with Gemini AI to get timestamps
    console.log(`[${jobId}] Analyzing video with AI...`);
    const clips = await analyzeVideoForClips(youtubeUrl);
    console.log(`[${jobId}] Found ${clips.length} clips`);

    // STEP 3: Process each clip
    const processedClips: ProcessedClip[] = [];

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      console.log(
        `[${jobId}] Processing clip ${i + 1}/${clips.length}: ${clip.title}`
      );

      try {
        // 3a: Cut the clip
        const cutPath = path.join(workDir, `clip-${i}-cut.mp4`);
        await cutVideoClip(videoPath, cutPath, clip.start, clip.duration);
        console.log(`[${jobId}]   - Cut complete`);

        // 3b: Crop to portrait (9:16)
        const croppedPath = path.join(workDir, `clip-${i}-cropped.mp4`);
        await cropToPortrait(cutPath, croppedPath);
        console.log(`[${jobId}]   - Cropped to portrait`);

        // 3c: Extract audio for transcription
        const audioPath = path.join(workDir, `clip-${i}.mp3`);
        await extractAudio(croppedPath, audioPath);
        console.log(`[${jobId}]   - Audio extracted`);

        // 3d: Transcribe audio with Whisper
        const transcription = await transcribeAudio(audioPath);
        console.log(`[${jobId}]   - Transcription complete`);

        // 3e: Generate SRT file
        const srtPath = path.join(workDir, `clip-${i}.srt`);
        generateSRT(transcription, srtPath);
        console.log(`[${jobId}]   - SRT generated`);

        // 3f: Embed captions
        const finalPath = path.join(workDir, `clip-${i}-final.mp4`);
        await embedCaptions(croppedPath, srtPath, finalPath);
        console.log(`[${jobId}]   - Captions embedded`);

        // 3g: Generate thumbnail
        const thumbnailPath = path.join(workDir, `clip-${i}-thumb.jpg`);
        await generateThumbnail(finalPath, thumbnailPath);
        console.log(`[${jobId}]   - Thumbnail generated`);

        // Store result
        processedClips.push({
          id: i + 1,
          title: clip.title,
          videoPath: `/temp/${jobId}/clip-${i}-final.mp4`,
          thumbnailPath: `/temp/${jobId}/clip-${i}-thumb.jpg`,
          duration: formatDuration(clip.duration),
          viralScore: clip.viralScore,
          timestamp: formatTimestamp(clip.start),
        });

        // Cleanup intermediate files
        fs.unlinkSync(cutPath);
        fs.unlinkSync(croppedPath);
        fs.unlinkSync(audioPath);
        fs.unlinkSync(srtPath);

        console.log(`[${jobId}] Clip ${i + 1} complete!`);
      } catch (error) {
        console.error(`[${jobId}] Failed to process clip ${i + 1}:`, error);
        // Continue with next clip
      }
    }

    // Cleanup original video
    fs.unlinkSync(videoPath);

    console.log(`[${jobId}] All clips processed successfully!`);
    return processedClips;
  } catch (error) {
    console.error(`[${jobId}] Pipeline error:`, error);
    // Cleanup on error
    fs.rmSync(workDir, { recursive: true, force: true });
    throw error;
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
