export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  title: string;
  client: string;
  contact: string;
  projectManager: string;
  brief: string;
  type: string;
  genre: string;
  duration: string;
  description: string;
  technicalRequirements: string;
  budget: string;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  deliverables: string[];
  productionRequirements: string;
  paymentNotes: string;
  additionalNotes: string;
  tags: string[];
  priority: TaskPriority;
  progress: number;
  stage: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  count: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}