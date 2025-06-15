
import { useState } from "react";
import { Habit } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { differenceInCalendarDays } from 'date-fns';
import { toast } from "sonner";
import HabitItem from "./HabitItem";

const initialHabits: Habit[] = [
  { id: crypto.randomUUID(), name: "Read for 15 minutes", streak: 5, lastCompletedDate: '2025-06-14' },
  { id: crypto.randomUUID(), name: "Go for a walk", streak: 12, lastCompletedDate: null },
  { id: crypto.randomUUID(), name: "Drink 8 glasses of water", streak: 2, lastCompletedDate: '2025-06-13' },
];

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [newHabitName, setNewHabitName] = useState("");

  const handleAddHabit = () => {
    if (newHabitName.trim() === "") {
      toast.error("Habit name cannot be empty.");
      return;
    }
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName.trim(),
      streak: 0,
      lastCompletedDate: null,
    };
    setHabits([...habits, newHabit]);
    setNewHabitName("");
    toast.success("New habit added! You can do it.");
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    toast.info("Habit removed.");
  };

  const handleCompleteHabit = (id: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    setHabits(habits.map((habit) => {
      if (habit.id === id) {
        if (habit.lastCompletedDate === todayStr) {
          toast.info("You've already completed this today!");
          return habit;
        }

        let newStreak = habit.streak;
        if (habit.lastCompletedDate) {
          const lastDate = new Date(habit.lastCompletedDate);
          const diff = differenceInCalendarDays(today, lastDate);
          if (diff === 1) {
            newStreak += 1;
            toast.success(`Streak increased to ${newStreak}! Keep it up!`);
          } else {
            newStreak = 1;
            toast.info("Streak reset to 1. A new beginning!");
          }
        } else {
          newStreak = 1;
          toast.info("First completion! Streak started at 1.");
        }

        return { ...habit, streak: newStreak, lastCompletedDate: todayStr };
      }
      return habit;
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Zenith Habit Tracker</CardTitle>
        <CardDescription>Commit to your goals. One day at a time.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {habits.length > 0 ? (
          <div>
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No habits yet. Add one below to get started!</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="e.g., Meditate for 5 minutes"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <Button onClick={handleAddHabit} disabled={!newHabitName.trim()}>
            <Plus className="mr-2 h-4 w-4" /> Add Habit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
