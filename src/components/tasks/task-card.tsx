'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, Flag, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityMap: {
  [key in Task['priority']]: { variant: 'destructive' | 'secondary' | 'outline'; label: string };
} = {
  High: { variant: 'destructive', label: 'High' },
  Medium: { variant: 'secondary', label: 'Medium' },
  Low: { variant: 'outline', label: 'Low' },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Link href={`/task/${task.id}`} className="hover:underline">
            <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && (
          <CardDescription className="text-sm pt-1 line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{task.assignee.name}</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5',
              isOverdue && 'text-destructive'
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>{format(dueDate, 'MMM d')}</span>
          </div>
        </div>
        <Badge
          variant={priorityMap[task.priority].variant}
          className="capitalize"
        >
          <Flag className="mr-1 h-3 w-3" />
          {priorityMap[task.priority].label}
        </Badge>
      </CardFooter>
    </Card>
  );
}
