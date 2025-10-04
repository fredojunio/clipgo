import { runFFmpeg } from "./ffmpeg-wrapper";
import path from "path";
import fs from "fs";

// Cut video clip
export async function cutVideo(
  inputPath: string,
  outputPath: string,
  startTime: number,
  duration: number
): Promise<string> {
  console.log(`Cutting video: ${startTime}s for ${duration}s`);

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
    "ultrafast",
    "-crf",
    "23",
    "-c:a",
    "aac",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  return outputPath;
}

// Crop to portrait
export async function cropToPortrait(
  inputPath: string,
  outputPath: string
): Promise<string> {
  console.log("Cropping to portrait...");

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

// Combine multiple videos
export async function combineVideos(
  videoPaths: string[],
  outputPath: string,
  workDir: string
): Promise<string> {
  console.log(`Combining ${videoPaths.length} videos...`);

  // Create concat file
  const concatFile = path.join(workDir, "concat.txt");
  const content = videoPaths
    .map((p) => `file '${path.resolve(p).replace(/\\/g, "/")}'`)
    .join("\n");

  fs.writeFileSync(concatFile, content, "utf-8");
  console.log("Concat file created:", concatFile);
  console.log("Contents:", content);

  const args = [
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatFile,
    "-c",
    "copy",
    "-y",
    outputPath,
  ];

  await runFFmpeg(args);
  fs.unlinkSync(concatFile);
  return outputPath;
}

// Extract audio
export async function extractAudio(
  inputPath: string,
  outputPath: string
): Promise<string> {
  console.log("Extracting audio...");

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

// Embed captions
export async function embedCaptions(
  inputPath: string,
  srtPath: string,
  outputPath: string
): Promise<string> {
  console.log("Embedding captions...");

  const normalizedSrtPath = path
    .resolve(srtPath)
    .replace(/\\/g, "/")
    .replace(/:/g, "\\:");

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

// Generate thumbnail
export async function generateThumbnail(
  inputPath: string,
  outputPath: string,
  timePosition: number = 1
): Promise<string> {
  console.log("Generating thumbnail...");

  const args = [
    "-i",
    inputPath,
    "-ss",
    timePosition.toString(),
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
