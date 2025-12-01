export type Assignee = {
  name: string;
  email: string;
  avatar: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignee: Assignee;
};

export type User = {
  name: string;
  email: string;
  avatar: string;
};
