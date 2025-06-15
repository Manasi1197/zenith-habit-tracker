
import { Habit } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flame, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitItemProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitItem = ({ habit, onComplete, onDelete }: HabitItemProps) => {
  const isCompletedToday = habit.last_completed_date === new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      <Button
        variant={isCompletedToday ? "default" : "outline"}
        size="icon"
        className={cn("h-10 w-10 shrink-0 rounded-full transition-all", isCompletedToday && "bg-green-500 hover:bg-green-600")}
        onClick={() => onComplete(habit.id)}
        disabled={isCompletedToday}
        aria-label={`Complete ${habit.name}`}
      >
        <Check className="h-5 w-5" />
      </Button>
      <div className="flex-grow">
        <p className="font-medium">{habit.name}</p>
        <p className="text-sm text-muted-foreground">
          {isCompletedToday ? "You're on a roll!" : "Keep the streak going."}
        </p>
      </div>
      <Badge variant="secondary" className="flex items-center gap-1.5 py-1 px-3">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="font-bold text-lg">{habit.streak}</span>
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(habit.id)}
        aria-label={`Delete ${habit.name}`}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default HabitItem;
