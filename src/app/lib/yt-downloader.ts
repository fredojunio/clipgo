// import ytdl from "ytdl-core";
// import fs from "fs";
// import path from "path";

// export async function downloadYouTubeVideo(
//   url: string,
//   outputDir: string
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const videoPath = path.join(outputDir, `video-${Date.now()}.mp4`);
//     const stream = fs.createWriteStream(videoPath);

//     ytdl(url, {
//       quality: "highestvideo",
//       filter: "videoandaudio",
//     })
//       .pipe(stream)
//       .on("finish", () => resolve(videoPath))
//       .on("error", reject);
//   });
// }

import { spawn } from "child_process";
import path from "path";

export async function downloadYouTubeVideo(
  url: string,
  outputDir: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const videoPath = path.join(outputDir, `video-${Date.now()}.mp4`);

    const yt = spawn("yt-dlp", ["-f", "mp4", "-o", videoPath, url]);

    yt.on("close", (code) => {
      if (code === 0) resolve(videoPath);
      else reject(new Error(`yt-dlp failed with code ${code}`));
    });
  });
}
