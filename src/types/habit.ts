
export interface Habit {
  id: string;
  user_id: string;
  name: string;
  streak: number;
  last_completed_date: string | null; // ISO date string: 'YYYY-MM-DD'
  created_at: string;
  updated_at: string;
}
