# FitZen

Приложение для тренировок, растяжки и медитаций.

## Возможности

- Тренировки (силовые, кардио, HIIT)
- Растяжка (йога, стретчинг)
- Медитация (релаксация, дыхание)
- Трекинг прогресса

## Запуск

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Откройте http://localhost:3000

## Стек

- Next.js 15 + React 19 + TypeScript
- Prisma + PostgreSQL
- JWT + bcrypt
- Tailwind CSS
- Framer Motion

## Структура

```
app/          # Pages & API
components/   # UI components
lib/          # Utilities
prisma/       # Database
```

## Команды

```bash
npm run dev            # Development
npm run build          # Production build
npm run prisma:studio  # Database GUI
```

## Деплой

Vercel + PostgreSQL (Neon/Supabase)

ENV:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```
