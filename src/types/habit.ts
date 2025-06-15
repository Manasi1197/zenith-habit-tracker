
export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompletedDate: string | null; // ISO date string: 'YYYY-MM-DD'
}
