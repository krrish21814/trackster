"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Calendar } from 'lucide-react';
import { useGoalStore } from '@/store/use-goals';
import { TaskFilters } from '@/app/components/TaskFilters';
import { GoalSearchFilter } from '@/app/components/GoalFilters';
import { Task } from '@/app/utils/types';
import { getCompletedTasks } from '@/app/actions/goals';
import { Pagination } from '@/app/components/Pagination';

const ITEMS_PER_PAGE = 3;

const HistoryPage = () => {
    const { goals } = useGoalStore();
    const [activeTab, setActiveTab] = useState('goals');
    const [searchQuery, setSearchQuery] = useState('');
    const [taskSearchQuery, setTaskSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [goalPage, setGoalPage] = useState(1);
    const [taskPage, setTaskPage] = useState(1);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                const dailyTasks = await getCompletedTasks();
                setTasks(dailyTasks);
            } catch (error) {
                console.error("Error fetching completed tasks:", error);
            }
        };
        fetchCompletedTasks();
    }, []);

    const completedGoals = useMemo(() => {
        return goals.filter(goal => goal.completed)
            .filter(goal =>
                goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                goal.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [goals, searchQuery]);

    const paginatedGoals = useMemo(() => {
        const start = (goalPage - 1) * ITEMS_PER_PAGE;
        return completedGoals.slice(start, start + ITEMS_PER_PAGE);
    }, [completedGoals, goalPage]);

    const completedTasks = useMemo(() => {
        return tasks.filter(task => task.completed)
            .filter(task => {
                const matchesSearch = task.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(taskSearchQuery.toLowerCase());
                const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
                return matchesSearch && matchesPriority;
            });
    }, [tasks, taskSearchQuery, filterPriority]);

    const paginatedTasks = useMemo(() => {
        const start = (taskPage - 1) * ITEMS_PER_PAGE;
        return completedTasks.slice(start, start + ITEMS_PER_PAGE);
    }, [completedTasks, taskPage]);

    return (
        <div className="max-w-7xl mx-auto h-[48rem] rounded-lg p-6 bg-[#F7F7F7]">
            <h1 className="text-5xl font-bold mb-6 text-[#222222]">History</h1>
            <div className="flex mb-6 border-b border-[#E0E0E0]">
                <button onClick={() => setActiveTab('goals')} className={`px-6 py-3 font-medium ${activeTab === 'goals' ? 'bg-[#E5E7EB] text-[#1F2937] border-b-2 border-[#1F2937]' : 'text-[#6B7280] hover:bg-[#D1D5DB]'}`}>Completed Goals</button>
                <button onClick={() => setActiveTab('tasks')} className={`px-6 py-3 font-medium ${activeTab === 'tasks' ? 'bg-[#E5E7EB] text-[#1F2937] border-b-2 border-[#1F2937]' : 'text-[#6B7280] hover:bg-[#D1D5DB]'}`}>Completed Tasks</button>
            </div>

            {activeTab === 'goals' && (
                <div>
                    <GoalSearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                    <div className="grid gap-4 mt-1">
                        {paginatedGoals.map(goal => (
                            <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] hover:shadow-md transition-shadow p-6">
                                <h3 className="text-xl font-semibold mb-2 text-[#222222]">{goal.title}</h3>
                                <p className="text-[#6B7280] mb-4">{goal.description}</p>
                                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                    <div className="flex items-center gap-1"><Tag className="w-4 h-4" /><span>{goal.tag}</span></div>
                                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>Completed: {goal.updatedAt ? new Date(goal.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not recorded'}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={goalPage} totalItems={completedGoals.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setGoalPage} />
                </div>
            )}

            {activeTab === 'tasks' && (
                <div>
                    <TaskFilters searchQuery={taskSearchQuery} onSearchChange={setTaskSearchQuery} filterPriority={filterPriority} onPriorityChange={setFilterPriority} />
                    <div className="grid gap-4 mt-6">
                        {paginatedTasks.map(task => (
                            <div key={task.id} className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] hover:shadow-md transition-shadow p-6">
                                <h3 className="text-xl font-semibold mb-2 text-[#222222]">{task.title}</h3>
                                <p className="text-[#6B7280] text-sm mb-4">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                    <div className="flex items-center gap-1"><Tag className="w-4 h-4" /><span>Priority: {task.priority}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={taskPage} totalItems={completedTasks.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setTaskPage} />
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
