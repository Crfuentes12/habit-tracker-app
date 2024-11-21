// src/types/habit.ts
export interface Habit {
    id: number;
    name: string;
    streak: number;
    completed: boolean;
    category: string;
    description?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
    daysCompleted: string[];  // Array de fechas en formato ISO string
    reminderTime?: string;
    target?: number;
    progress?: number;
  }