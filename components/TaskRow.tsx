import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2, Brain } from "lucide-react";
import { getLabelColors } from "@/lib/labels";
import { Task } from "@/types/models";

interface TaskRowProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const TaskRow = ({ task, onDelete, onToggleComplete }: TaskRowProps) => {
  const formatDate = (dateString: string) => {
    return dateString.split("T")[0];
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "";
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="py-2">
        <Checkbox
          checked={task.completed!}
          onCheckedChange={(checked) =>
            onToggleComplete(task.task_id, checked as boolean)
          }
        />
      </TableCell>
      <TableCell className="py-2">
        <div className="space-y-1">
          <Link
            href={`/task?id=${task.task_id}`}
            className="hover:underline font-medium block"
          >
            {task.title}
          </Link>
          {/* AI Insights Preview */}
          {(task.priority || task.estimated_time) && (
            <div className="flex items-center gap-2 text-xs">
              <Brain className="w-3 h-3 text-purple-600" />
              {task.priority && (
                <Badge variant="outline" className={getPriorityColor(task.priority) + " text-xs"}>
                  {task.priority.toUpperCase()}
                </Badge>
              )}
              {task.estimated_time && (
                <span className="text-gray-500">~{task.estimated_time} min</span>
              )}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="py-2">
        {task.label && (
          <Badge
            variant="outline"
            className={[
              getLabelColors(task.label)["bg-color"],
              getLabelColors(task.label)["text-color"],
              getLabelColors(task.label)["border-color"],
            ].join(" ")}
          >
            {task.label}
          </Badge>
        )}
      </TableCell>
      <TableCell className="py-2 whitespace-nowrap">
        {task.due_date ? formatDate(task.due_date) : ""}
      </TableCell>
      <TableCell className="text-right py-2">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href={`/task?id=${task.task_id}`}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(task.task_id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
