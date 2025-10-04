import { spawn } from "child_process";
import { execSync } from "child_process";

// Get FFmpeg path with fallback
export function getFFmpegPath(): string {
  // Try @ffmpeg-installer with dynamic require (avoids webpack issues)
  try {
    const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
    if (ffmpegInstaller && ffmpegInstaller.path) {
      console.log("Using FFmpeg from @ffmpeg-installer:", ffmpegInstaller.path);
      return ffmpegInstaller.path;
    }
  } catch (error) {
    console.log("Could not load @ffmpeg-installer, trying system FFmpeg...");
  }

  // Fallback to system FFmpeg
  try {
    const systemPath = execSync("which ffmpeg || where ffmpeg")
      .toString()
      .trim();
    console.log("Using system FFmpeg:", systemPath);
    return systemPath;
  } catch {
    throw new Error(
      "FFmpeg not found. Please install system FFmpeg: https://ffmpeg.org/download.html"
    );
  }
}

// Base FFmpeg execution wrapper
export function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegPath = getFFmpegPath();

    console.log("Running FFmpeg:", ffmpegPath);
    console.log("Args:", args.join(" "));

    const ffmpeg = spawn(ffmpegPath, args);

    let stderr = "";

    ffmpeg.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
      process.stdout.write(data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
      }
    });

    ffmpeg.on("error", (err) => {
      reject(new Error(`FFmpeg spawn error: ${err.message}`));
    });
  });
}
