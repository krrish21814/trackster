import { useState } from 'react';
import { Task, Goal } from '@prisma/client';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa';
import { ConfirmationDialog } from './ConfirmationDialog';

type TaskWithGoal = Task & { goal: Goal };

interface TaskCardProps {
  task: TaskWithGoal;
  onComplete: (taskId: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete(task.id);
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-md flex justify-between items-start transition hover:shadow-lg border ${task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
        }`}>
      <div className="space-y-2 flex-1">
        <div className="flex items-center space-x-3">
          <h3 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>{task.title}</h3>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${task.priority === 'P1' ? 'bg-red-500 text-white' :
              task.priority === 'P2' ? 'bg-yellow-400 text-gray-800' :
                'bg-green-500 text-white'
            }`}>
            {task.priority}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Goal:</span> {task.goal.title}
        </p>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>

      <div className="flex items-center space-x-4 ml-4">
        {task.completedAt && (
          <p className="text-xs text-gray-500 mb-1">
            Completed: {new Date(task.completedAt).toLocaleString()}
          </p>
        )}

        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition">
          Edit
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-800 transition">
          <AiOutlineDelete className="w-6 h-6" />
        </button>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => onComplete(task.id, e.target.checked)}
            className="hidden"/>
          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-green-500 border-green-500' : 'bg-white border-gray-400'
            }`}>
            {task.completed ? <FaCheck className="w-4 h-4 text-white" /> : null}
          </div>
        </label>
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this task?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)} />
    </div>
  );
}