import fs from "fs";

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export function generateSRT(
  words: WordTimestamp[],
  outputPath: string
): string {
  let srtContent = "";

  words.forEach((word, index) => {
    const startTime = formatSRTTime(word.start);
    const endTime = formatSRTTime(word.end);

    srtContent += `${index + 1}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${word.word.toUpperCase()}\n\n`;
  });

  fs.writeFileSync(outputPath, srtContent, "utf-8");
  return outputPath;
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

function pad(num: number, size: number = 2): string {
  return num.toString().padStart(size, "0");
}
