// lib/youtube-downloader.ts
import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";

export async function downloadYouTubeVideo(
  url: string,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const videoPath = path.join(outputPath, `video-${Date.now()}.mp4`);

    ytdl(url, {
      quality: "highestvideo",
      filter: "videoandaudio",
    })
      .pipe(fs.createWriteStream(videoPath))
      .on("finish", () => resolve(videoPath))
      .on("error", reject);
  });
}
