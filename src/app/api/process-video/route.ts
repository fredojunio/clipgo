import { NextRequest, NextResponse } from "next/server";
import { processYouTubeVideo } from "@/app/lib/complete-pipeline";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = `job-${Date.now()}`;

    console.log(`Starting job ${jobId} for URL: ${url}`);

    // Process the video (this will take several minutes)
    const clips = await processYouTubeVideo(url, jobId);

    return NextResponse.json({
      success: true,
      message: "Video processed successfully!",
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

// Optional: Add timeout configuration for long-running processes
// export const maxDuration = 300; // 5 minutes (Vercel Pro required)
