
import { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut } from "lucide-react";
import { differenceInCalendarDays } from 'date-fns';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import HabitItem from "./HabitItem";

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  // Fetch habits from Supabase
  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching habits:', error);
        toast.error("Failed to load habits");
        return;
      }

      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const handleAddHabit = async () => {
    if (newHabitName.trim() === "") {
      toast.error("Habit name cannot be empty.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            name: newHabitName.trim(),
            user_id: user?.id,
            streak: 0,
            last_completed_date: null,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating habit:', error);
        toast.error("Failed to create habit");
        return;
      }

      setHabits([data, ...habits]);
      setNewHabitName("");
      toast.success("New habit added! You can do it.");
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error("Failed to create habit");
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting habit:', error);
        toast.error("Failed to delete habit");
        return;
      }

      setHabits(habits.filter((habit) => habit.id !== id));
      toast.info("Habit removed.");
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error("Failed to delete habit");
    }
  };

  const handleCompleteHabit = async (id: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    if (habit.last_completed_date === todayStr) {
      toast.info("You've already completed this today!");
      return;
    }

    let newStreak = habit.streak;
    if (habit.last_completed_date) {
      const lastDate = new Date(habit.last_completed_date);
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

    try {
      const { data, error } = await supabase
        .from('habits')
        .update({
          streak: newStreak,
          last_completed_date: todayStr,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating habit:', error);
        toast.error("Failed to update habit");
        return;
      }

      setHabits(habits.map((h) => h.id === id ? data : h));
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error("Failed to update habit");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.info("Signed out successfully");
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8 text-center">
          <p>Loading your habits...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">Zenith Habit Tracker</CardTitle>
            <CardDescription>Commit to your goals. One day at a time.</CardDescription>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
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
