'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';
import Link from 'next/link';

interface Stats {
  totalActivities: number;
  totalMinutes: number;
  currentStreak: number;
  workoutCount: number;
  stretchingCount: number;
  meditationCount: number;
}

interface Activity {
  id: string;
  activityType: string;
  completedAt: string;
  duration: number;
  workout?: { title: string };
  stretching?: { title: string };
  meditation?: { title: string };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/stats').then(r => r.json()),
      fetch('/api/activities?limit=10').then(r => r.json()),
    ])
      .then(([statsData, activitiesData]) => {
        setStats(statsData);
        setActivities(activitiesData);
      })
      .catch(error => console.error('Error loading dashboard:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Dashboard
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Активностей
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalActivities || 0}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Минут
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalMinutes || 0}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Серия
              </div>
              <div className="text-3xl font-bold text-primary-600">
                {stats?.currentStreak || 0} 🔥
              </div>
            </Card>

            <Card>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Типы
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="success">💪 {stats?.workoutCount || 0}</Badge>
                <Badge variant="warning">🧘 {stats?.stretchingCount || 0}</Badge>
                <Badge>🧠 {stats?.meditationCount || 0}</Badge>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/workouts">
              <Card hover className="text-center cursor-pointer">
                <div className="text-5xl mb-3">💪</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Тренировки
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Начать
                </p>
              </Card>
            </Link>

            <Link href="/stretching">
              <Card hover className="text-center cursor-pointer">
                <div className="text-5xl mb-3">🧘</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Растяжка
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Начать
                </p>
              </Card>
            </Link>

            <Link href="/meditation">
              <Card hover className="text-center cursor-pointer">
                <div className="text-5xl mb-3">🧠</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Медитация
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Начать
                </p>
              </Card>
            </Link>
          </div>

          {/* Recent Activities */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Активности
            </h2>

            {activities.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Нет активностей
              </p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => {
                  const title =
                    activity.workout?.title ||
                    activity.stretching?.title ||
                    activity.meditation?.title ||
                    'Активность';

                  const icon =
                    activity.activityType === 'workout'
                      ? '💪'
                      : activity.activityType === 'stretching'
                      ? '🧘'
                      : '🧠';

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(activity.completedAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.duration ? formatDuration(activity.duration) : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
