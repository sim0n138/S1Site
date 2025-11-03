'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';

interface Workout {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  level: string;
  caloriesBurn: number;
  thumbnailUrl?: string;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', level: '' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.type) params.append('type', filter.type);
    if (filter.level) params.append('level', filter.level);

    fetch(`/api/workouts?${params}`)
      .then(r => r.json())
      .then(data => setWorkouts(data))
      .catch(error => console.error('Error loading workouts:', error))
      .finally(() => setLoading(false));
  }, [filter]);

  const levelColors: Record<string, any> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Тренировки
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="">Все</option>
              <option value="strength">Силовые</option>
              <option value="cardio">Кардио</option>
              <option value="hiit">HIIT</option>
              <option value="functional">Функциональные</option>
            </select>

            <select
              value={filter.level}
              onChange={(e) => setFilter({ ...filter, level: e.target.value })}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="">Все</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout) => (
                <Link key={workout.id} href={`/workouts/${workout.id}`}>
                  <Card hover className="h-full cursor-pointer">
                    {workout.thumbnailUrl && (
                      <img
                        src={workout.thumbnailUrl}
                        alt={workout.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workout.title}
                      </h3>
                      <Badge variant={levelColors[workout.level] || 'default'}>
                        {workout.level}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {workout.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>⏱️ {formatDuration(workout.duration)}</span>
                      <span>🔥 {workout.caloriesBurn} ккал</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
