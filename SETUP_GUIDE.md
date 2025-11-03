# Установка

## БД

Локально:
```bash
brew install postgresql@15  # macOS
psql postgres
CREATE DATABASE fitzen;
```

Облачно: Neon/Supabase/Railway

`.env`:
```
DATABASE_URL="postgresql://..."
```

## Запуск

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

http://localhost:3000

## Деплой

Vercel + PostgreSQL

ENV:
```
DATABASE_URL=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
NEXT_PUBLIC_APP_URL=...
```

Build: `prisma generate && next build`

## Команды

```bash
npm run dev            # Development
npm run prisma:studio  # Database GUI
npm run prisma:seed    # Test data
```
