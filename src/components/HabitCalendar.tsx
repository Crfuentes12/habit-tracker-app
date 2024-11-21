// src/components/habits/HabitCalendar.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Habit } from '@/app/types/habit';
import { addDays, format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarDay {
  date: Date;
  habitsCompleted: string[];
  totalHabits: number;
  completionRate: number;
}

export default function HabitCalendar() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [selectedHabit, setSelectedHabit] = React.useState<string>('all');
  
  const habits: Habit[] = [
    {
      id: 1,
      name: "Meditar",
      streak: 5,
      completed: true,
      category: "Salud",
      daysCompleted: [
        new Date().toISOString(),
        addDays(new Date(), -1).toISOString(),
      ]
    },
  ];

  const getMonthData = () => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days: CalendarDay[] = [];
    let currentDate = start;

    while (currentDate <= end) {
      const habitsForDay = habits.filter(habit =>
        habit.daysCompleted.some((completedDate: string) =>
          isSameDay(new Date(completedDate), currentDate)
        )
      );

      days.push({
        date: currentDate,
        habitsCompleted: habitsForDay.map(h => h.name),
        totalHabits: habits.length,
        completionRate: (habitsForDay.length / habits.length) * 100
      });

      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const calendarData = getMonthData();

  const modifiersStyles = {
    highlightedDay: {
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
    }
  };

  const modifiers = {
    highlightedDay: (date: Date) => {
      return calendarData.some(day => 
        isSameDay(day.date, date) && day.habitsCompleted.length > 0
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendario de Hábitos</CardTitle>
              <CardDescription>
                Seguimiento mensual de tus hábitos
              </CardDescription>
            </div>
            <Select 
              value={selectedHabit} 
              onValueChange={setSelectedHabit}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por hábito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los hábitos</SelectItem>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id.toString()}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              locale={es}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              footer={
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded" />
                    <span className="text-sm">No completado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded" />
                    <span className="text-sm">&lt;50%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 rounded" />
                    <span className="text-sm">50-80%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded" />
                    <span className="text-sm">&gt;80%</span>
                  </div>
                </div>
              }
            />
            {/* Mostrar información del día seleccionado */}
            {date && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  Hábitos completados el {format(date, 'dd/MM/yyyy')}
                </h3>
                <div className="mt-2 space-y-2">
                  {calendarData
                    .find(day => isSameDay(day.date, date))
                    ?.habitsCompleted.map((habit, index) => (
                      <Badge key={index} variant="secondary" className="mr-2">
                        {habit}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}