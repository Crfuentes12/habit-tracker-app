// src/app/habits/page.tsx
'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HabitTracker from '@/components/HabitTracker';
import HabitCalendar from '@/components/HabitCalendar';
import HabitStats from '@/components/HabitStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Calendar,
  ListTodo,
  BarChart2,
} from 'lucide-react';

export default function HabitsPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="daily" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                Vista Diaria
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendario
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Estadísticas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="space-y-4">
            <HabitTracker />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <HabitCalendar />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <HabitStats />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}