import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath!, args);

    ffmpeg.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg failed with code ${code}`));
    });

    ffmpeg.on("error", reject);
  });
}

export async function cutVideoClip(
  inputPath: string,
  outputPath: string,
  startTime: number,
  duration: number
): Promise<string> {
  const args = [
    "-i",
    inputPath,
    "-ss",
    startTime.toString(),
    "-t",
    duration.toString(),
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "23",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  return outputPath;
}

export async function cropToPortrait(
  inputPath: string,
  outputPath: string
): Promise<string> {
  const args = [
    "-i",
    inputPath,
    "-vf",
    "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920",
    "-c:a",
    "copy",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  return outputPath;
}

export async function extractAudio(
  inputPath: string,
  outputPath: string
): Promise<string> {
  const args = [
    "-i",
    inputPath,
    "-vn",
    "-acodec",
    "libmp3lame",
    "-ar",
    "16000",
    "-ac",
    "1",
    "-b:a",
    "64k",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  return outputPath;
}

export async function embedCaptions(
  inputPath: string,
  srtPath: string,
  outputPath: string
): Promise<string> {
  const normalizedSrtPath = srtPath.replace(/\\/g, "/").replace(/:/g, "\\:");

  const subtitleStyle = [
    "FontName=Arial Bold",
    "FontSize=28",
    "PrimaryColour=&H00FFFFFF",
    "OutlineColour=&H00000000",
    "BorderStyle=3",
    "Outline=2",
    "Alignment=2",
    "MarginV=100",
  ].join(",");

  const args = [
    "-i",
    inputPath,
    "-vf",
    `subtitles=${normalizedSrtPath}:force_style='${subtitleStyle}'`,
    "-c:a",
    "copy",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  return outputPath;
}

export async function generateThumbnail(
  inputPath: string,
  outputPath: string
): Promise<string> {
  const args = [
    "-i",
    inputPath,
    "-ss",
    "1",
    "-vframes",
    "1",
    "-vf",
    "scale=1080:-1",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  return outputPath;
}
