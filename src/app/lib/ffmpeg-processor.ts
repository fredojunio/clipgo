// import ffmpegStatic from "ffmpeg-static";
// import { spawn } from "child_process";
// import path from "path";
// import fs from "fs";

// // Fix FFmpeg path
// const ffmpegPath = ffmpegStatic || "ffmpeg";

// function runFFmpeg(args: string[]): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (!ffmpegPath) {
//       reject(new Error("FFmpeg binary not found"));
//       return;
//     }

//     const ffmpeg = spawn(ffmpegPath, args);

//     ffmpeg.stderr.on("data", (data) => {
//       console.log(data.toString());
//     });

//     ffmpeg.on("close", (code) => {
//       if (code === 0) resolve();
//       else reject(new Error(`FFmpeg failed with code ${code}`));
//     });

//     ffmpeg.on("error", reject);
//   });
// }

// // Cut individual moments
// export async function cutMoment(
//   inputPath: string,
//   outputPath: string,
//   start: number,
//   duration: number
// ): Promise<string> {
//   const args = [
//     "-i",
//     inputPath,
//     "-ss",
//     start.toString(),
//     "-t",
//     duration.toString(),
//     "-c",
//     "copy",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   return outputPath;
// }

// // Create concat file for FFmpeg
// function createConcatFile(videoPaths: string[], concatFilePath: string): void {
//   const content = videoPaths
//     .map((p) => `file '${p.replace(/\\/g, "/")}'`)
//     .join("\n");

//   fs.writeFileSync(concatFilePath, content, "utf-8");
// }

// // Combine multiple video segments into one
// export async function combineMoments(
//   momentPaths: string[],
//   outputPath: string,
//   workDir: string
// ): Promise<string> {
//   const concatFile = path.join(workDir, "concat.txt");
//   createConcatFile(momentPaths, concatFile);

//   const args = [
//     "-f",
//     "concat",
//     "-safe",
//     "0",
//     "-i",
//     concatFile,
//     "-c",
//     "copy",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   fs.unlinkSync(concatFile); // Cleanup
//   return outputPath;
// }

// // Add smooth transitions between moments
// export async function combineMomentsWithTransitions(
//   momentPaths: string[],
//   outputPath: string,
//   transitionDuration: number = 0.5
// ): Promise<string> {
//   // Build complex filter for crossfade transitions
//   let filterComplex = "";
//   let currentLabel = "[0:v]";

//   for (let i = 0; i < momentPaths.length - 1; i++) {
//     const nextLabel = `[v${i}]`;
//     filterComplex += `${currentLabel}[${
//       i + 1
//     }:v]xfade=transition=fade:duration=${transitionDuration}:offset=0${nextLabel};`;
//     currentLabel = nextLabel;
//   }

//   filterComplex = filterComplex.slice(0, -1); // Remove trailing semicolon

//   const inputArgs = momentPaths.flatMap((p) => ["-i", p]);

//   const args = [
//     ...inputArgs,
//     "-filter_complex",
//     filterComplex,
//     "-c:a",
//     "aac",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   return outputPath;
// }

// // Crop to portrait after combining
// export async function cropToPortrait(
//   inputPath: string,
//   outputPath: string
// ): Promise<string> {
//   const args = [
//     "-i",
//     inputPath,
//     "-vf",
//     "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920",
//     "-c:a",
//     "copy",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   return outputPath;
// }

// // Extract audio for transcription
// export async function extractAudio(
//   inputPath: string,
//   outputPath: string
// ): Promise<string> {
//   const args = [
//     "-i",
//     inputPath,
//     "-vn",
//     "-acodec",
//     "libmp3lame",
//     "-ar",
//     "16000",
//     "-ac",
//     "1",
//     "-b:a",
//     "64k",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   return outputPath;
// }

// // Embed captions
// export async function embedCaptions(
//   inputPath: string,
//   srtPath: string,
//   outputPath: string
// ): Promise<string> {
//   const normalizedSrtPath = srtPath.replace(/\\/g, "/").replace(/:/g, "\\:");

//   const subtitleStyle = [
//     "FontName=Arial Bold",
//     "FontSize=28",
//     "PrimaryColour=&H00FFFFFF",
//     "OutlineColour=&H00000000",
//     "BorderStyle=3",
//     "Outline=2",
//     "Alignment=2",
//     "MarginV=100",
//   ].join(",");

//   const args = [
//     "-i",
//     inputPath,
//     "-vf",
//     `subtitles=${normalizedSrtPath}:force_style='${subtitleStyle}'`,
//     "-c:a",
//     "copy",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   return outputPath;
// }

// // Generate thumbnail
// export async function generateThumbnail(
//   inputPath: string,
//   outputPath: string
// ): Promise<string> {
//   const args = [
//     "-i",
//     inputPath,
//     "-ss",
//     "1",
//     "-vframes",
//     "1",
//     "-vf",
//     "scale=1080:-1",
//     "-y",
//     outputPath,
//   ];

//   await runFFmpeg(args);
//   return outputPath;
// }
