import path from "path";
import fs from "fs";
import { analyzeVideoForMontages, MontageClip } from "./gemini-analyzer";
import { downloadYouTubeVideo } from "./yt-downloader";
import {
  cutVideo,
  combineVideos,
  cropToPortrait,
  extractAudio,
  embedCaptions,
  generateThumbnail,
} from "./video-operations";
import { transcribeAudio } from "./speech-to-text";
import { generateSRT } from "./srt-generator";

export interface ProcessedMontage {
  id: number;
  title: string;
  videoPath: string;
  thumbnailPath: string;
  duration: string;
  viralScore: number;
  timestamp: string;
  momentsCount: number;
}

export async function processYouTubeVideoMontages(
  youtubeUrl: string,
  jobId: string,
  numberOfClips: number = 10
): Promise<ProcessedMontage[]> {
  const workDir = path.join(process.cwd(), "public", "temp", jobId);
  fs.mkdirSync(workDir, { recursive: true });

  console.log(`[${jobId}] Starting montage processing...`);

  try {
    // STEP 1: Download YouTube video
    console.log(`[${jobId}] Downloading video...`);
    const videoPath = await downloadYouTubeVideo(youtubeUrl, workDir);
    console.log(`[${jobId}] Video downloaded: ${videoPath}`);

    // STEP 2: Analyze with Gemini AI
    console.log(`[${jobId}] Analyzing video with AI...`);
    const montages = await analyzeVideoForMontages(youtubeUrl, numberOfClips);
    console.log(`[${jobId}] Found ${montages.length} montage clips`);

    // STEP 3: Process each montage
    const processedMontages: ProcessedMontage[] = [];

    for (let i = 0; i < montages.length; i++) {
      const montage = montages[i];
      console.log(
        `[${jobId}] Processing montage ${i + 1}/${montages.length}: ${
          montage.title
        }`
      );

      try {
        const montageWorkDir = path.join(workDir, `montage-${i}`);
        fs.mkdirSync(montageWorkDir, { recursive: true });

        // Cut each moment
        console.log(
          `[${jobId}]   - Cutting ${montage.moments.length} moments...`
        );
        const momentPaths: string[] = [];

        for (let j = 0; j < montage.moments.length; j++) {
          const moment = montage.moments[j];
          const momentPath = path.join(montageWorkDir, `moment-${j}.mp4`);

          console.log(
            `[${jobId}]     - Cutting moment ${j + 1}: ${moment.start}s for ${
              moment.duration
            }s`
          );
          await cutVideo(videoPath, momentPath, moment.start, moment.duration);
          momentPaths.push(momentPath);
        }

        // Combine moments
        console.log(`[${jobId}]   - Combining moments...`);
        const combinedPath = path.join(workDir, `montage-${i}-combined.mp4`);
        await combineVideos(momentPaths, combinedPath, montageWorkDir);

        // Crop to portrait
        console.log(`[${jobId}]   - Cropping to portrait...`);
        const croppedPath = path.join(workDir, `montage-${i}-cropped.mp4`);
        await cropToPortrait(combinedPath, croppedPath);

        // Extract audio
        console.log(`[${jobId}]   - Extracting audio...`);
        const audioPath = path.join(workDir, `montage-${i}.mp3`);
        await extractAudio(croppedPath, audioPath);

        // Transcribe
        console.log(`[${jobId}]   - Transcribing...`);
        const transcription = await transcribeAudio(audioPath);

        // Generate SRT
        console.log(`[${jobId}]   - Generating captions...`);
        const srtPath = path.join(workDir, `montage-${i}.srt`);
        generateSRT(transcription, srtPath);

        // Embed captions
        console.log(`[${jobId}]   - Embedding captions...`);
        const finalPath = path.join(workDir, `montage-${i}-final.mp4`);
        await embedCaptions(croppedPath, srtPath, finalPath);

        // Generate thumbnail
        console.log(`[${jobId}]   - Generating thumbnail...`);
        const thumbnailPath = path.join(workDir, `montage-${i}-thumb.jpg`);
        await generateThumbnail(finalPath, thumbnailPath);

        processedMontages.push({
          id: i + 1,
          title: montage.title,
          videoPath: `/temp/${jobId}/montage-${i}-final.mp4`,
          thumbnailPath: `/temp/${jobId}/montage-${i}-thumb.jpg`,
          duration: formatDuration(montage.totalDuration),
          viralScore: montage.viralScore,
          timestamp: formatTimestamp(montage.moments[0].start),
          momentsCount: montage.moments.length,
        });

        // Cleanup
        fs.rmSync(montageWorkDir, { recursive: true, force: true });
        fs.unlinkSync(combinedPath);
        fs.unlinkSync(croppedPath);
        fs.unlinkSync(audioPath);
        fs.unlinkSync(srtPath);

        console.log(`[${jobId}] Montage ${i + 1} complete!`);
      } catch (error) {
        console.error(`[${jobId}] Failed to process montage ${i + 1}:`, error);
      }
    }

    // Cleanup
    fs.unlinkSync(videoPath);

    console.log(`[${jobId}] All montages processed!`);
    return processedMontages;
  } catch (error) {
    console.error(`[${jobId}] Pipeline error:`, error);
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
