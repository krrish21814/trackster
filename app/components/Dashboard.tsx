"use client"
import React, { useEffect, useState } from 'react';
import { FaFire, FaMedal, FaTrophy, FaPlus } from 'react-icons/fa';
import { Goal, Medal, MedalType } from '@prisma/client';
import { Pagination } from './Pagination';
import { useStreakStore } from '@/store/useStreakStore';
import { Task } from '../utils/types';

interface DashboardProps {
    goals: (Goal & { tasks: Task[] })[];
    medals: Medal[];
    initialStreak: number;
    onNewGoal: () => void;
}

export function Dashboard({ goals, medals, initialStreak, onNewGoal }: DashboardProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const { streak, setStreak } = useStreakStore()

    useEffect(() => {
        if (streak !== initialStreak) {
            setStreak(initialStreak);
        }
    }, [initialStreak, streak, setStreak]);

    const activeGoals = goals.filter(goal => !goal.completed);
    const completedTasks = goals.reduce((total, goal) =>
        total + goal.tasks.filter(task => task.completed).length, 0
    );
    const indexOfLastGoal = currentPage * itemsPerPage;
    const indexOfFirstGoal = indexOfLastGoal - itemsPerPage;
    const paginatedGoals = activeGoals.slice(indexOfFirstGoal, indexOfLastGoal);

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
            default: return 'gray';
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

    return (
        <div className="h-[47rem] bg-[#F7F7F7] p-6 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-[#222222]">Dashboard Overview</h2>
                    {streak > 0 && (
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-[#E0E0E0]">
                            <FaFire className="text-orange-500" />
                            <span className="font-bold">{streak} day streak</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={onNewGoal}
                    className="bg-[#374151] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#1F2937] transition-colors"
                >
                    <FaPlus />
                    <span>New Goal</span>
                </button>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl border border-[#E0E0E0]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[#6B7280]">Active Goals</h3>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaTrophy className="text-blue-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#222222] mt-2">{activeGoals.length}</p>
                    <p className="text-sm text-[#6B7280] mt-2">In Progress</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#E0E0E0]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[#6B7280]">Completed Tasks</h3>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FaFire className="text-green-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#222222] mt-2">{completedTasks}</p>
                    <p className="text-sm text-[#6B7280] mt-2">Total completed</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#E0E0E0]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[#6B7280]">Earned Medals</h3>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FaMedal className="text-purple-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#222222] mt-2">{medals.length}</p>
                    <p className="text-sm text-[#6B7280] mt-2">Achievement unlocked</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 flex-1">
                <div className="col-span-2 bg-white rounded-xl border border-[#E0E0E0] p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold text-[#222222] mb-4">Recent Goals</h3>
                    <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 2rem)" }}>
                        {paginatedGoals.length > 0 ? paginatedGoals.map((goal) => (
                            <div key={goal.id} className="p-4 bg-[#F7F7F7] rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-[#222222]">{goal.title}</h4>
                                        <p className="text-sm text-[#6B7280] mt-1">
                                            Due {new Date(goal.deadLine).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                        {goal.tag}
                                    </span>
                                </div>
                                <div className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full"
                                        style={{
                                            width: `${goal.tasks.length > 0
                                                ? (goal.tasks.filter(task => task.completed).length / goal.tasks.length) * 100
                                                : 0}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-[#6B7280] py-8">No active goals. Create one to get started!</p>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={activeGoals.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>

                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold text-[#222222] mb-4">Recent Medals</h3>
                    <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 2rem)" }}>
                        {medals.length > 0 ? medals.map((medal) => (
                            <div key={medal.id} className="flex items-center space-x-3 p-3 bg-[#F7F7F7] rounded-lg">
                                <div className={`p-2 `}>
                                    <FaMedal className={`${getMedalColor(medal.type)} text-xl`} />
                                </div>
                                <div>
                                    <p className="font-medium text-[#222222]">{getMedalTitle(medal.type)}</p>
                                    <p className="text-sm text-[#6B7280]">
                                        Earned {new Date(medal.earnedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-[#6B7280] py-8">No medals earned yet. Keep up your streak to earn medals!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
