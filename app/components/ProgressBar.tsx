interface ProgressBarProps {
    total: number
    completed: number
  }
  
  export function ProgressBar({ total, completed }: ProgressBarProps) {
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0
  
    return (
      <div className="space-y-2">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}/>
        </div>
        <p className="text-center text-sm text-gray-600">
          {completed} of {total} tasks completed ({Math.round(progressPercentage)}%)
        </p>
      </div>
    )
  }