import { getTaskById } from "@/lib/tasks";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Flag, User, FileText, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

const priorityMap: {
    [key in 'Low' | 'Medium' | 'High']: { variant: 'outline' | 'secondary' | 'destructive', className: string };
  } = {
    Low: { variant: 'outline', className: 'border-gray-400 text-gray-500' },
    Medium: { variant: 'secondary', className: 'border-yellow-400 text-yellow-600 bg-yellow-50' },
    High: { variant: 'destructive', className: 'border-red-400 text-red-600 bg-red-50' },
};

const statusMap: {
    [key in 'To Do' | 'In Progress' | 'Done']: { icon: React.ElementType, className: string };
} = {
    'To Do': { icon: FileText, className: 'text-blue-500' },
    'In Progress': { icon: Clock, className: 'text-yellow-500' },
    'Done': { icon: CheckCircle, className: 'text-green-500' },
};

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
    const task = await getTaskById(params.id);

    if (!task) {
        notFound();
    }
    
    const StatusIcon = statusMap[task.status].icon;

    return (
        <div className="container mx-auto max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{task.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <StatusIcon className={`h-6 w-6 ${statusMap[task.status].className}`} />
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="font-semibold">{task.status}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <User className="h-6 w-6 text-muted-foreground" />
                           <div>
                                <p className="text-sm text-muted-foreground">Assignee</p>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignee.avatar} />
                                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold">{task.assignee.name}</p>
                                </div>
                           </div>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Due Date</p>
                                <p className="font-semibold">{format(new Date(task.dueDate), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Flag className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Priority</p>
                                <Badge variant={priorityMap[task.priority].variant} className={priorityMap[task.priority].className}>
                                    {task.priority}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
