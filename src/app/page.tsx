// src/app/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a Habit Tracker</h1>
        <Link href="/habits">
          <Button size="lg">
            Ir a mis hábitos
          </Button>
        </Link>
      </div>
    </div>
  );
}