"use client";

import { Column, Task } from "@/types/kanban";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  column: Column;
  onAddTask: (status: Column['id']) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({ column, onAddTask, onEditTask }: KanbanColumnProps) {
  const columnStyles = {
    'todo': 'border-t-4 border-t-blue-500',
    'in-progress': 'border-t-4 border-t-yellow-500',
    'done': 'border-t-4 border-t-green-500'
  };

  return (
    <div className={`bg-muted/50 rounded-lg p-4 min-h-[500px] ${columnStyles[column.id]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          {column.title}
          <span className="ml-2 text-muted-foreground">({column.tasks.length})</span>
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddTask(column.id)}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
}