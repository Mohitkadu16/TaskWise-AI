import type { Task } from '@/lib/types';
import { TaskCard } from './task-card';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusColorMap: { [key: string]: string } = {
  'To Do': 'bg-blue-500',
  'In Progress': 'bg-yellow-500',
  'Done': 'bg-green-500',
};

export function TaskColumn({ title, tasks, onEditTask, onDeleteTask }: TaskColumnProps) {
  return (
    <div className="w-full">
      <div className="bg-muted rounded-lg p-1 h-full flex flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-3 h-3 rounded-full ${statusColorMap[title] || 'bg-gray-400'}`}></div>
            <h2 className="font-semibold text-base truncate">{title}</h2>
          </div>
          <span className="bg-primary/20 text-primary font-bold text-xs px-2 py-0.5 rounded-full ml-2">
            {tasks.length}
          </span>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask}/>
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10">
              No tasks here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
