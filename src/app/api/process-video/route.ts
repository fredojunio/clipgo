import { NextRequest, NextResponse } from "next/server";
import { processYouTubeVideoMontages } from "@/app/lib/complete-pipeline";

export async function POST(request: NextRequest) {
  try {
    const { url, numberOfClips } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "YouTube URL is required" },
        { status: 400 }
      );
    }

    const jobId = `job-${Date.now()}`;
    const clipsCount = numberOfClips || 10;

    console.log(`Starting montage job ${jobId} for URL: ${url}`);

    const clips = await processYouTubeVideoMontages(url, jobId, clipsCount);

    return NextResponse.json({
      success: true,
      message: `${clips.length} montage clips created successfully!`,
      jobId,
      clips,
    });
  } catch (error: any) {
    console.error("Processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process video",
      },
      { status: 500 }
    );
  }
}
