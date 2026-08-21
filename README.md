# GymTrack

**App en vivo:** [gymtrack-vert.vercel.app](https://gymtrack-vert.vercel.app)

App de seguimiento de entrenamientos: rutinas, biblioteca de ejercicios con fotos y video, entrenamiento en vivo con temporizador de descanso, progreso, historial y récords personales. Cuenta con login (email y Google), un cuestionario inicial que genera una rutina personalizada según tus días de entrenamiento, y funciona como PWA instalable.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (auth + base de datos Postgres)
- React Router
- Recharts, @dnd-kit

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa con tus credenciales de Supabase
npm run dev
```

El esquema de base de datos necesario está en `supabase/schema.sql` — córrelo en el SQL Editor de tu proyecto de Supabase antes de usar la app.

## Build

```bash
npm run build
```

## Despliegue

Conectado a Vercel — cada push a `master` despliega automáticamente. Variables de entorno necesarias en el proyecto de Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
