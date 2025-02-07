"use client";

import { signIn } from "next-auth/react";
import { Target, Flame, Trophy, ArrowRight } from "lucide-react";

export default function Landing() {
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F7F7] to-white">
      <nav className="border-b border-[#E0E0E0] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-[#374151]" />
            <span className="text-2xl font-bold text-[#1F2937]">Trackster</span>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="bg-[#374151] hover:bg-[#1F2937] text-white px-4 py-2 rounded-lg text-md transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-4 mb-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7F7F7] rounded-full mb-6">
            <Flame className="w-4 h-4 text-[#374151]" />
            <span className="text-sm font-medium text-[#374151]">Track Better, Achieve More</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight">
            Transform Your Goals
            <br /> Into <span className="text-[#374151]">Reality</span>
          </h1>
          <p className="text-xl text-[#6B7280] mb-12 leading-relaxed">
            Set meaningful goals, build lasting habits,
            <br /> and maintain streaks that drive success.
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="bg-[#374151] hover:bg-[#1F2937] text-white py-4 px-8 rounded-lg inline-flex items-center gap-3 text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z" />
            </svg>
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1F2937] mb-12">
            Everything you need to achieve more
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-[#E0E0E0] hover:shadow-lg transition-shadow">
              <Target className="w-8 h-8 text-[#374151] mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Smart Goal Setting</h3>
              <p className="text-[#6B7280]">Create clear, actionable goals with deadlines and milestones</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E0E0E0] hover:shadow-lg transition-shadow">
              <Flame className="w-8 h-8 text-[#374151] mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Streak Tracking</h3>
              <p className="text-[#6B7280]">Build momentum with daily streaks and progress visualization</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E0E0E0] hover:shadow-lg transition-shadow">
              <Trophy className="w-8 h-8 text-[#374151] mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Achievement System</h3>
              <p className="text-[#6B7280]">Earn rewards and track your accomplishments over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}