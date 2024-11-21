// src/components/habits/HabitStats.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface StatsData {
  date: string;
  completed: number;
  total: number;
  completionRate: number;
}

export default function HabitStats() {
  const [timeRange, setTimeRange] = React.useState('week');
  const [selectedHabit, setSelectedHabit] = React.useState('all');

  // Simulamos datos de estadísticas (esto debería venir de tu estado global o base de datos)
  const generateStatsData = (): StatsData[] => {
    const data: StatsData[] = [];
    const today = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 30;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const completed = Math.floor(Math.random() * 5) + 1; // Simulamos datos
      const total = 5;
      data.push({
        date: format(date, 'dd/MM'),
        completed,
        total,
        completionRate: (completed / total) * 100
      });
    }

    return data;
  };

  const statsData = generateStatsData();

  // Calculamos estadísticas generales
  const calculateOverallStats = () => {
    const totalCompleted = statsData.reduce((acc, day) => acc + day.completed, 0);
    const totalPossible = statsData.reduce((acc, day) => acc + day.total, 0);
    const averageCompletion = (totalCompleted / totalPossible) * 100;
    
    const streak = statsData
      .reverse()
      .findIndex(day => day.completed < day.total);

    return {
      totalCompleted,
      averageCompletion: averageCompletion.toFixed(1),
      currentStreak: streak === -1 ? statsData.length : streak,
      bestDay: statsData.reduce((best, day) => 
        day.completionRate > (best?.completionRate || 0) ? day : best
      , statsData[0])
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedHabit} onValueChange={setSelectedHabit}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por hábito" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los hábitos</SelectItem>
            {/* Aquí irían tus hábitos */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Completado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.averageCompletion}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Racha Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.currentStreak} días
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.totalCompleted}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Mejor Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.bestDay?.date}
            </div>
            <div className="text-xs text-muted-foreground">
              {overallStats.bestDay?.completionRate.toFixed(1)}% completado
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progreso Diario</CardTitle>
          <CardDescription>
            Tasa de completado de hábitos por día
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="completionRate" 
                  fill="#3b82f6"
                  name="Tasa de completado"
                  unit="%"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}