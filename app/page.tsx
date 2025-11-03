import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-primary-600">FitZen</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Тренировки, растяжка, медитация
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Начать
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Войти
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Тренировки
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Силовые, кардио, HIIT
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Растяжка
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Йога, стретчинг
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Медитация
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Релаксация, дыхание
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
