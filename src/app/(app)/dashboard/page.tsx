import { getTasks } from '@/lib/tasks';
import { TaskBoard } from '@/components/tasks/task-board';
import { Suspense } from 'react';

function DashboardSkeleton() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 shrink-0">
                        <div className="bg-muted rounded-lg p-1 h-full flex flex-col">
                            <div className="h-10 p-2 m-1 bg-background rounded-md animate-pulse"/>
                             <div className="p-2 space-y-4">
                                <div className="h-32 bg-background rounded-md animate-pulse"/>
                                <div className="h-32 bg-background rounded-md animate-pulse"/>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


async function Dashboard() {
    const tasks = await getTasks();
        return (
            <div className="max-w-7xl mx-auto px-4">
                <TaskBoard initialTasks={tasks} />
            </div>
        );
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
    </Suspense>
  );
}
