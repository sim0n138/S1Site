'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';

interface StretchingSession {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  level: string;
  thumbnailUrl?: string;
}

export default function StretchingPage() {
  const [sessions, setSessions] = useState<StretchingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stretching')
      .then(r => r.json())
      .then(data => setSessions(data))
      .catch(error => console.error('Error loading stretching:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Растяжка
          </h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} hover className="cursor-pointer">
                  {session.thumbnailUrl && (
                    <img
                      src={session.thumbnailUrl}
                      alt={session.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {session.title}
                    </h3>
                    <Badge>{session.level}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {session.description}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ⏱️ {formatDuration(session.duration)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
