"use client";

import { Task } from "@/types/kanban";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 hover:bg-green-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    high: "bg-red-100 text-red-800 hover:bg-red-100"
  };

  return (
    <Card 
      className="cursor-move hover:shadow-lg transition-shadow"
      onClick={() => onEdit?.(task)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium line-clamp-2">
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", priorityColors[task.priority])}
          >
            {task.priority}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}