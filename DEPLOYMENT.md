# Деплой

## БД

PostgreSQL: Supabase/Neon/Render

```bash
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

## Vercel

1. Import проект из GitHub
2. ENV:
   ```
   DATABASE_URL=...
   JWT_SECRET=...
   JWT_REFRESH_SECRET=...
   ```
3. Deploy

## Проверка

Тест: регистрация → вход → функции
