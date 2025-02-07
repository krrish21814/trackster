"use client"
import React, { useState } from 'react';
import { FaMedal, FaFire, FaCalendarAlt, FaClock, FaTrophy, FaUser } from 'react-icons/fa';
import { Medal, MedalType, User } from '@prisma/client';
import { updateUserProfile } from '../actions/profile';
import { useRouter } from 'next/navigation';
import { Pagination } from './Pagination';

interface SettingsFormProps {
  initialUser: User & { medals: Medal[]; goals: { completed: boolean }[] };
}

const SettingsForm = ({ initialUser }: SettingsFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialUser.name,
    email: initialUser.email
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const medalsPerPage = 2;
  const completedGoals = initialUser.goals.filter(goal => goal.completed).length;

  const sortedMedals = [...initialUser.medals].sort((a, b) =>
    new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  );

  const indexOfLastMedal = currentPage * medalsPerPage;
  const indexOfFirstMedal = indexOfLastMedal - medalsPerPage;
  const currentMedals = sortedMedals.slice(indexOfFirstMedal, indexOfLastMedal);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getMedalColor = (type: MedalType) => {
    switch (type) {
      case 'WEEK_STREAK': return 'text-amber-600';
      case 'TWO_WEEK_STREAK': return 'text-slate-400';
      case 'MONTH_STREAK': return 'text-yellow-400';
      case 'HALF_YEAR_STREAK': return 'text-purple-500';
      case 'YEAR_STREAK': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getMedalTitle = (type: MedalType) => {
    switch (type) {
      case 'WEEK_STREAK': return '7 Day Streak';
      case 'TWO_WEEK_STREAK': return '14 Day Streak';
      case 'MONTH_STREAK': return '30 Day Streak';
      case 'HALF_YEAR_STREAK': return '180 Day Streak';
      case 'YEAR_STREAK': return '365 Day Streak';
      default: return 'Unknown Medal';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateUserProfile(initialUser.id, formData);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-lg mt-10 bg-[#F7F7F7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E0E0E0] flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaFire className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Current Streak</p>
              <p className="text-xl font-bold text-[#1F2937]">{initialUser.overallStreak} days</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E0E0E0] flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FaTrophy className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Completed Goals</p>
              <p className="text-xl font-bold text-[#1F2937]">{completedGoals}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E0E0E0] flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaMedal className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Total Medals</p>
              <p className="text-xl font-bold text-[#1F2937]">{initialUser.medals.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
            <div className="p-6 border-b border-[#E0E0E0] flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#1F2937]">Profile Settings</h2>
              <div className="text-sm text-[#6B7280] flex items-center space-x-2">
                <FaCalendarAlt className="text-[#6B7280]" />
                <span>Member since {new Date(initialUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#E5E7EB] rounded-full flex items-center justify-center">
                  <FaUser className="text-2xl text-[#6B7280]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#1F2937]">{initialUser.name}</h3>
                  <p className="text-sm text-[#6B7280]">{initialUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#222222]">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#374151] focus:border-transparent transition"
                  disabled={isUpdating} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#222222]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#374151] focus:border-transparent transition"
                  disabled={isUpdating} />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E0E0E0]">
                <div className="text-sm text-[#6B7280] flex items-center space-x-2">
                  <FaClock className="text-[#6B7280]" />
                  <span>Last active: {initialUser.lastActivity ? new Date(initialUser.lastActivity).toLocaleDateString() : 'Never'}</span>
                </div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#374151] text-white rounded-md hover:bg-[#1F2937] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#374151] disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0]">
            <div className="p-6 border-b border-[#E0E0E0]">
              <h2 className="text-xl font-semibold text-[#1F2937]">Achievements & Medals</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {currentMedals.map((medal) => (
                  <div
                    key={medal.id}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg border border-[#E0E0E0] hover:border-[#374151] transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-50 rounded-full">
                        <FaMedal className={`text-3xl ${getMedalColor(medal.type)}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#222222] group-hover:text-[#374151] transition-colors">
                          {getMedalTitle(medal.type)}
                        </h3>
                        <p className="text-sm text-[#6B7280]">
                          Earned: {new Date(medal.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-[#6B7280] border-t border-[#E0E0E0] pt-4">
                      {medal.type === 'YEAR_STREAK' && "An incredible achievement! You've maintained your streak for an entire year."}
                      {medal.type === 'HALF_YEAR_STREAK' && "Impressive dedication! Six months of consistent progress."}
                      {medal.type === 'MONTH_STREAK' && "You're building great habits! A full month of dedication."}
                      {medal.type === 'TWO_WEEK_STREAK' && "You're gaining momentum! Two weeks of consistent effort."}
                      {medal.type === 'WEEK_STREAK' && "Great start! You've completed your first week streak."}
                    </div>
                  </div>
                ))}

                {initialUser.medals.length === 0 && (
                  <div className="text-center py-8 text-[#6B7280]">
                    <FaMedal className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">No medals earned yet</p>
                    <p className="text-sm">Keep up your daily streak to earn medals!</p>
                  </div>
                )}

                {initialUser.medals.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalItems={sortedMedals.length}
                    itemsPerPage={medalsPerPage}
                    onPageChange={handlePageChange} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;