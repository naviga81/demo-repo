import type { Task } from '../types';
import { LABEL_COMPLETED } from '../utils/strings';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">{task.title}</h2>
        {task.completed && (
          <span className="shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            {LABEL_COMPLETED}
          </span>
        )}
      </div>
      {task.description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
      )}
      <time
        className="mt-2 block text-xs text-gray-400 dark:text-gray-500"
        dateTime={task.createdAt}
      >
        {new Date(task.createdAt).toLocaleDateString()}
      </time>
    </div>
  );
}
