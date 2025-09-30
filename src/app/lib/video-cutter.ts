// lib/video-cutter.ts
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

interface ClipTimestamp {
  start: number;
  end: number;
  title: string;
  viralScore: number;
}

// Helper function to format seconds to HH:MM:SS.mmm format
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`;
}

export async function cutVideoClip(
  inputPath: string,
  outputDir: string,
  clip: ClipTimestamp,
  index: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const duration = clip.end - clip.start;
    const outputPath = path.join(outputDir, `clip-${index}-${Date.now()}.mp4`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // FFmpeg command arguments
    const args = [
      '-i', inputPath,                    // Input file
      '-ss', formatTime(clip.start),      // Start time
      '-t', formatTime(duration),         // Duration
      '-c', 'copy',                       // Copy streams (faster, no re-encoding)
      '-avoid_negative_ts', 'make_zero',  // Handle timestamp issues
      '-y',                               // Overwrite output file
      outputPath                          // Output file
    ];

    const ffmpegProcess = spawn('ffmpeg', args);
    
    let errorOutput = '';
    
    // Capture stderr for error reporting
    ffmpegProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}\nError: ${errorOutput}`));
      }
    });
    
    ffmpegProcess.on('error', (error) => {
      reject(new Error(`Failed to start FFmpeg process: ${error.message}`));
    });
  });
}

// Optional progress callback type
type ProgressCallback = (progress: { current: number; total: number; clipIndex: number }) => void;

// Enhanced video cutting with optional progress tracking
export async function cutVideoClipWithProgress(
  inputPath: string,
  outputDir: string,
  clip: ClipTimestamp,
  index: number,
  progressCallback?: ProgressCallback,
  totalClips?: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const duration = clip.end - clip.start;
    const outputPath = path.join(outputDir, `clip-${index}-${Date.now()}.mp4`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // FFmpeg command arguments with progress reporting
    const args = [
      '-i', inputPath,
      '-ss', formatTime(clip.start),
      '-t', formatTime(duration),
      '-c', 'copy',
      '-avoid_negative_ts', 'make_zero',
      '-progress', 'pipe:1',  // Enable progress output
      '-y',
      outputPath
    ];

    const ffmpegProcess = spawn('ffmpeg', args);
    
    let errorOutput = '';
    let progressOutput = '';
    
    // Capture stdout for progress (when -progress pipe:1 is used)
    ffmpegProcess.stdout.on('data', (data) => {
      progressOutput += data.toString();
      // You can parse progress here if needed
    });
    
    // Capture stderr for error reporting
    ffmpegProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        if (progressCallback && totalClips) {
          progressCallback({ current: index + 1, total: totalClips, clipIndex: index });
        }
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}\nError: ${errorOutput}`));
      }
    });
    
    ffmpegProcess.on('error', (error) => {
      reject(new Error(`Failed to start FFmpeg process: ${error.message}`));
    });
  });
}

// Cut multiple clips with progress tracking
export async function cutMultipleClips(
  inputPath: string,
  outputDir: string,
  clips: ClipTimestamp[],
  progressCallback?: ProgressCallback
): Promise<string[]> {
  const results: string[] = [];
  
  // Process clips sequentially to avoid overwhelming the system
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    try {
      const outputPath = await cutVideoClipWithProgress(
        inputPath,
        outputDir,
        clip,
        i,
        progressCallback,
        clips.length
      );
      results.push(outputPath);
    } catch (error) {
      throw new Error(`Failed to cut clip ${i}: ${error}`);
    }
  }
  
  return results;
}

// Parallel version (faster but uses more resources)
export async function cutMultipleClipsParallel(
  inputPath: string,
  outputDir: string,
  clips: ClipTimestamp[]
): Promise<string[]> {
  const promises = clips.map((clip, index) =>
    cutVideoClip(inputPath, outputDir, clip, index)
  );

  return Promise.all(promises);
}

// Utility function to validate input file
export async function validateVideoFile(inputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const args = ['-i', inputPath, '-f', 'null', '-'];
    const ffmpegProcess = spawn('ffmpeg', args);
    
    ffmpegProcess.on('close', (code) => {
      resolve(code === 0);
    });
    
    ffmpegProcess.on('error', () => {
      resolve(false);
    });
  });
}
