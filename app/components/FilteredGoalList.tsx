'use client';

import { useState } from 'react';
import { EditGoalModal } from './EditGoalModal';
import { deleteGoal, updateGoal as updateGoalServer } from '../actions/goals';
import { useGoalStore } from '@/store/use-goals';
import { CiCalendarDate } from 'react-icons/ci';
import { Goal } from '../utils/types';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Pagination } from '../components/Pagination';
import { updateUserStreak } from '../actions/streak';
import { useSession } from 'next-auth/react';
import { useStreakStore } from '@/store/useStreakStore';

interface FilteredGoalListProps {
  tag: 'WORK' | 'PERSONAL';
  searchQuery: string;
  loading: boolean;
}

export function FilteredGoalList({ loading, tag, searchQuery }: FilteredGoalListProps) {
  const { goals, setSelectedGoal, setTaskModalOpen, updateGoal } = useGoalStore();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const goalsPerPage = 3;
    const { data: session } = useSession();
    const userId = Number(session?.user?.id);

  const filteredGoals = goals.filter(
    (goal) =>
      goal.tag === tag &&
      !goal.completed &&
      goal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastGoal = currentPage * goalsPerPage;
  const indexOfFirstGoal = indexOfLastGoal - goalsPerPage;
  const currentGoals = filteredGoals.slice(indexOfFirstGoal, indexOfLastGoal);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewTasks = (goal: Goal) => {
    setSelectedGoal(goal);
    setTaskModalOpen(true);
  };

  const handleDelete = (goalId: number) => {
    setGoalToDelete(goalId);
    setShowConfirm(true);
  };

  const confirmDeleteGoal = async () => {
    if (goalToDelete !== null) {
      await deleteGoal(goalToDelete);
      useGoalStore.getState().deleteGoal(goalToDelete);
      setShowConfirm(false);
      setGoalToDelete(null);
    }
  };
    const handleUpdate = (updatedGoal: Goal) => {
    updateGoal(updatedGoal);
    setEditingGoal(null);
    setIsOpen(false);
  };

  const handleMarkComplete = async (goal: Goal) => {
    const wasCompleted = goal.completed;
    const updatedGoal = { ...goal, completed: !goal.completed };
    await updateGoalServer(goal.id, { completed: updatedGoal.completed });
    useGoalStore.getState().updateGoal(updatedGoal);
    if (!wasCompleted) {
      await updateUserStreak(userId);
      useStreakStore.getState().incrementStreak();
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-gray-500 mt-7">
          <p className="text-lg font-medium animate-pulse">Loading goals...</p>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg font-medium">No {tag.toLowerCase()} goals found.</p>
          <p className="text-sm">Start by adding some {tag.toLowerCase()} goals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-[#F9FAFB] p-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-lg font-medium text-[#1F2937]">{goal.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{goal.description}</p>

              <div className="mt-3 flex gap-4 text-xs text-[#4B5563]">
                <span className="flex items-center text-gray-500">
                  <div className="text-black text-lg pr-1">
                    <CiCalendarDate />
                  </div>
                  <div>{new Date(goal.deadLine).toLocaleDateString()}</div>
                </span>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <button
                  onClick={() => handleViewTasks(goal)}
                  className="bg-[#374151] text-white py-2 px-6 rounded-full hover:bg-[#1F2937] transition-all flex items-center space-x-2 text-sm">
                  <span>View Tasks</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setIsOpen(true);
                    }}
                    className="bg-[#6B7280] text-white py-2 px-4 rounded-full hover:bg-[#4B5563] transition-all text-xs">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="bg-[#EF4444] text-white py-2 px-4 rounded-full hover:bg-[#DC2626] transition-all text-xs">
                    Delete
                  </button>
                  <button
                    onClick={() => handleMarkComplete(goal)}
                    className="bg-[#10B981] text-white py-2 px-4 rounded-full hover:bg-[#059669] transition-all text-xs">
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
            {filteredGoals.length > goalsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredGoals.length}
          itemsPerPage={goalsPerPage}
          onPageChange={handlePageChange}/>
      )}

      {isOpen && editingGoal && (
        <div className="fixed top-6 right-5 h-[48rem] w-[31rem] bg-[#F7F7F7] rounded-2xl shadow-lg p-6 overflow-y-auto">
          <button
            onClick={() => {
              setIsOpen(false);
              setEditingGoal(null);
            }}
            className="absolute top-4 right-4 text-[#6B7280] hover:text-[#F87171] transition-all text-3xl">
            &times;
          </button>
          <EditGoalModal
            goal={editingGoal}
            onClose={() => {
              setIsOpen(false);
              setEditingGoal(null);
            }}
            onUpdate={handleUpdate}/>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this goal?"
        onConfirm={confirmDeleteGoal}
        onCancel={() => setShowConfirm(false)}/>
    </div>
  );
}
