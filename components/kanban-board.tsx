"use client";

import { useState } from "react";
import { Column, Task, TaskStatus } from "@/types/kanban";
import { KanbanColumn } from "./kanban-column";
import { TaskDialog } from "./task-dialog";

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ]);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(undefined);
    setDefaultStatus(status);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setDefaultStatus(task.status);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Update existing task
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskData.id
              ? {
                  ...task,
                  ...taskData,
                  updatedAt: new Date(),
                } as Task
              : task
          ),
        }))
      );

      // Move task to different column if status changed
      if (selectedTask && taskData.status !== selectedTask.status) {
        setColumns((prevColumns) => {
          const updatedColumns = [...prevColumns];
          
          // Remove from old column
          const oldColumnIndex = updatedColumns.findIndex(
            (col) => col.id === selectedTask.status
          );
          if (oldColumnIndex !== -1) {
            updatedColumns[oldColumnIndex].tasks = updatedColumns[
              oldColumnIndex
            ].tasks.filter((task) => task.id !== taskData.id);
          }

          // Add to new column
          const newColumnIndex = updatedColumns.findIndex(
            (col) => col.id === taskData.status
          );
          if (newColumnIndex !== -1) {
            const updatedTask = {
              ...selectedTask,
              ...taskData,
              updatedAt: new Date(),
            } as Task;
            updatedColumns[newColumnIndex].tasks.push(updatedTask);
          }

          return updatedColumns;
        });
      }
    } else {
      // Create new task
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status!,
        priority: taskData.priority!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === taskData.status
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        )
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
          />
        ))}
      </div>
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        defaultStatus={defaultStatus}
        onSave={handleSaveTask}
      />
    </div>
  );
}