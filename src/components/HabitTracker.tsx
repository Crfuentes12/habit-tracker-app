// src/app/components/HabitTracker.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, 
  Trash2, 
  Calendar,
  Bell,
  Tag,
  Clock,
  Target,
  Repeat
} from "lucide-react";

interface Habit {
  id: number;
  name: string;
  description?: string;
  streak: number;
  completed: boolean;
  lastCompleted?: Date;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
  target: number;
  progress: number;
  daysCompleted: string[];
}

const categories = [
  'Salud',
  'Ejercicio',
  'Desarrollo Personal',
  'Trabajo',
  'Estudio',
  'Otros'
];

export default function HabitTracker() {
  const [habits, setHabits] = React.useState<Habit[]>([
    {
      id: 1,
      name: "Meditar",
      description: "15 minutos de meditación mindfulness",
      streak: 0,
      completed: false,
      category: "Salud",
      frequency: "daily",
      target: 15,
      progress: 0,
      daysCompleted: [],
      reminderTime: "08:00"
    },
    // ... más hábitos iniciales
  ]);

  const [newHabit, setNewHabit] = React.useState({
    name: '',
    description: '',
    category: 'Otros',
    frequency: 'daily',
    target: 1,
    reminderTime: ''
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('todos');

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now(),
        name: newHabit.name.trim(),
        description: newHabit.description,
        streak: 0,
        completed: false,
        category: newHabit.category,
        frequency: newHabit.frequency as 'daily' | 'weekly' | 'monthly',
        target: newHabit.target,
        progress: 0,
        daysCompleted: [],
        reminderTime: newHabit.reminderTime
      };
      setHabits([...habits, habit]);
      setNewHabit({
        name: '',
        description: '',
        category: 'Otros',
        frequency: 'daily',
        target: 1,
        reminderTime: ''
      });
      setDialogOpen(false);
    }
  };

  const toggleHabit = (id: number) => {
    const now = new Date();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const lastCompleted = habit.lastCompleted;
        const isNewDay = !lastCompleted || 
          now.getDate() !== new Date(lastCompleted).getDate();
        const daysCompleted = isNewDay && !habit.completed 
          ? [...habit.daysCompleted, now.toISOString().split('T')[0]]
          : habit.daysCompleted;

        return {
          ...habit,
          completed: !habit.completed,
          streak: isNewDay 
            ? (habit.completed ? habit.streak - 1 : habit.streak + 1) 
            : habit.streak,
          progress: !habit.completed 
            ? Math.min(habit.progress + 1, habit.target) 
            : habit.progress - 1,
          lastCompleted: !habit.completed ? now : undefined,
          daysCompleted
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  };

  const filteredHabits = habits.filter(habit => 
    filter === 'todos' || habit.category === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear nuevo hábito</DialogTitle>
              <DialogDescription>
                Define los detalles de tu nuevo hábito
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  placeholder="Ej: Meditar, Leer, Ejercicio..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="Describe tu hábito..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({...newHabit, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Select
                  value={newHabit.frequency}
                  onValueChange={(value) => setNewHabit({...newHabit, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target">Meta diaria</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit({...newHabit, target: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminder">Recordatorio</Label>
                <Input
                  id="reminder"
                  type="time"
                  value={newHabit.reminderTime}
                  onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={addHabit}>Crear Hábito</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredHabits.map((habit) => (
          <Card key={habit.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={habit.completed}
                    onCheckedChange={() => toggleHabit(habit.id)}
                    className="h-6 w-6"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{habit.name}</h3>
                      <Badge variant="secondary">{habit.category}</Badge>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {habit.progress}/{habit.target}
                      </div>
                      <div className="flex items-center gap-1">
                        <Repeat className="h-4 w-4" />
                        Racha: {habit.streak} días
                      </div>
                      {habit.reminderTime && (
                        <div className="flex items-center gap-1">
                          <Bell className="h-4 w-4" />
                          {habit.reminderTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteHabit(habit.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}