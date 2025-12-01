import { NextResponse } from 'next/server';
import { getTaskById, updateTask, deleteTask } from '@/lib/tasks';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const task = await getTaskById(params.id);
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ task });
  } catch (err: any) {
    console.error('API /api/tasks/[id] GET error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await updateTask(params.id, {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate,
      assignee: body.assignee,
    });

    if (!updated) return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
    return NextResponse.json({ task: updated });
  } catch (err: any) {
    console.error('API /api/tasks/[id] PUT error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await deleteTask(params.id);
    if (!result.success) return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /api/tasks/[id] DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete task' }, { status: 500 });
  }
}
