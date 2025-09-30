"use client";

import React, { useState } from "react";
import {
  Play,
  Download,
  Share2,
  Trash2,
  Edit3,
  Clock,
  TrendingUp,
  Search,
  Grid3x3,
  List,
  ChevronDown,
} from "lucide-react";

interface Clip {
  id: number;
  thumbnail: string;
  title: string;
  duration: string;
  viralScore: number;
  timestamp: string;
}

export default function ClipsResultsUI() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("viral-score");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for clips
  const clips: Clip[] = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
      title: "The Secret Strategy Behind Crypto Success",
      duration: "00:45",
      viralScore: 95,
      timestamp: "00:00",
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      title: "Why Most Investors Fail at Bitcoin",
      duration: "00:38",
      viralScore: 92,
      timestamp: "01:23",
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop",
      title: "Market Analysis: What Experts Won't Tell You",
      duration: "00:52",
      viralScore: 89,
      timestamp: "03:45",
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop",
      title: "Trading Psychology & Emotional Control",
      duration: "01:05",
      viralScore: 87,
      timestamp: "05:12",
    },
    {
      id: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
      title: "DeFi Revolution: The Future is Here",
      duration: "00:41",
      viralScore: 85,
      timestamp: "07:34",
    },
    {
      id: 6,
      thumbnail:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
      title: "NFT Investing: Risks & Opportunities",
      duration: "00:56",
      viralScore: 83,
      timestamp: "09:15",
    },
    {
      id: 7,
      thumbnail:
        "https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=400&h=300&fit=crop",
      title: "Portfolio Diversification Strategies",
      duration: "00:49",
      viralScore: 81,
      timestamp: "11:28",
    },
    {
      id: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400&h=300&fit=crop",
      title: "Blockchain Technology Explained Simply",
      duration: "01:12",
      viralScore: 79,
      timestamp: "13:45",
    },
    {
      id: 9,
      thumbnail:
        "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=300&fit=crop",
      title: "Smart Contract Security Best Practices",
      duration: "00:58",
      viralScore: 76,
      timestamp: "16:02",
    },
    {
      id: 10,
      thumbnail:
        "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=300&fit=crop",
      title: "Future Trends in Cryptocurrency Markets",
      duration: "01:03",
      viralScore: 74,
      timestamp: "18:20",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "Viral Potential";
    if (score >= 80) return "High Engagement";
    if (score >= 70) return "Good Content";
    return "Standard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Generated Clips
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                10 clips ready • Total duration: 9m 19s
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Download All
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Export Project
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="viral-score">Viral Score</option>
                  <option value="duration">Duration</option>
                  <option value="timestamp">Timestamp</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clips Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }
        >
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Thumbnail - Portrait 9:16 ratio */}
              <div className="relative aspect-[9/16] bg-gray-100 overflow-hidden">
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 hover:scale-110 transform">
                    <Play
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                    />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {clip.duration}
                </div>
                <div className="absolute top-2 left-2 bg-white text-gray-900 text-xs px-2 py-1 rounded font-medium">
                  {clip.timestamp}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {clip.title}
                </h3>

                {/* Viral Score */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Viral Score</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getScoreColor(
                      clip.viralScore
                    )}`}
                  >
                    <span className="text-lg font-bold">{clip.viralScore}</span>
                  </div>
                </div>

                <div
                  className={`text-xs font-medium px-2 py-1 rounded inline-block mb-3 ${getScoreColor(
                    clip.viralScore
                  )}`}
                >
                  {getScoreBadge(clip.viralScore)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Edit3 className="h-4 w-4" />
                    <span className="text-xs font-medium">Edit</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Download className="h-4 w-4" />
                    <span className="text-xs font-medium">Download</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Share</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
