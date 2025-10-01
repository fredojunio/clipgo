"use client";
import React, { JSX, useState } from "react";
import {
  Upload,
  Youtube,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type StatusType = "success" | "error" | null;

interface FormState {
  url: string;
  isLoading: boolean;
  status: StatusType;
  message: string;
}

export default function YouTubeUploadUI(): JSX.Element {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusType>(null);
  const [message, setMessage] = useState<string>("");

  // YouTube URL validation
  const isValidYouTubeUrl = (url: string): boolean => {
    const patterns: RegExp[] = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];
    return patterns.some((pattern: RegExp) => pattern.test(url));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!url.trim()) {
      setStatus("error");
      setMessage("Please enter a YouTube URL");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setStatus("error");
      setMessage("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setMessage("");

    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Redirect to results page
        console.log("Job ID:", data.jobId);
        router.push(`/results/${data.jobId}`);
        // router.push(`/results`);
      }

      setStatus("success");
      setMessage(
        data.message ||
          "Video submitted successfully! Processing will begin shortly."
      );
      setUrl("");
    } catch (error: unknown) {
      setStatus("error");
      setMessage("Failed to submit video. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
    if (status) {
      setStatus(null);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Youtube className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Video Clipper
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your YouTube videos into viral clips with AI
          </p>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label
                htmlFor="youtube-url"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                YouTube Video URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Youtube className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="youtube-url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`text-gray-700 w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    status === "error"
                      ? "border-red-300 bg-red-50"
                      : status === "success"
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status Messages */}
            {status && (
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg ${
                  status === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                isLoading || !url.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Generate AI Clips</span>
                </>
              )}
            </button>
          </div>

          {/* Features List */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600">
                  AI analyzes your video content
                </p>
              </div>
              <div className="p-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600">
                  Identifies viral moments
                </p>
              </div>
              <div className="p-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600">Creates optimized clips</p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Supports all public YouTube videos • Processing takes 2-5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
