'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  notes?: string;
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    fetch('/api/progress')
      .then(r => r.json())
      .then(data => setProgress(data))
      .catch(error => console.error('Error loading progress:', error))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : undefined,
          notes,
          date: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setWeight('');
        setNotes('');
        loadProgress();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Прогресс
          </h1>

          {/* Add Entry Form */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Новая запись
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="number"
                step="0.1"
                label="Вес (кг)"
                placeholder="75.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={submitting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Заметки
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Заметки"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <Button type="submit" disabled={submitting || (!weight && !notes)}>
                {submitting ? 'Сохранение...' : 'Добавить'}
              </Button>
            </form>
          </Card>

          {/* Progress History */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              История
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : progress.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Нет записей
              </p>
            ) : (
              <div className="space-y-4">
                {progress.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {entry.weight && (
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {entry.weight} кг
                        </span>
                      )}
                    </div>
                    {entry.notes && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
