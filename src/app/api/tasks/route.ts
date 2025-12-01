import { NextResponse } from 'next/server';
import { getTasks, addTask } from '@/lib/tasks';

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json({ tasks });
  } catch (err: any) {
    console.error('API /api/tasks GET error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Expecting { title, description, status, priority, dueDate, assignee }
    const created = await addTask({
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate,
      assignee: body.assignee,
    });

    return NextResponse.json({ task: created });
  } catch (err: any) {
    console.error('API /api/tasks POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create task' }, { status: 500 });
  }
}
