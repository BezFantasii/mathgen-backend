# Описание запуска

1. Создать базу и выполнить создание таблицы пользователей:
```sql
-- Database: MathGen

-- DROP DATABASE IF EXISTS "MathGen";

CREATE DATABASE "MathGen"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    login character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    score integer DEFAULT 0,
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    petname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_login timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    daily_tasks integer DEFAULT 0,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_login_key UNIQUE (login)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
```

2. Скачиваем зависимости:
`npm install`

3. Заполнить переменные окружения по образцу `.env.example`.

4. Запустить проект:
`npm run dev`

5. Радуемся 🥲