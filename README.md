# nodejs-hw — 02-mongodb

Бекенд на Express для роботи з колекцією нотаток у MongoDB через Mongoose.

## Що реалізовано

- Підключення до MongoDB Atlas через Mongoose (`src/db/connectMongoDB.js`)
  - рядок підключення зберігається у змінній оточення `MONGO_URL`
  - при успішному підключенні виводиться `✅ MongoDB connection established successfully`
- Express-сервер (`src/server.js`) з коректною структурою:
  - `express.json()` для роботи з JSON
  - `cors` для CORS
  - логування HTTP-запитів через окремий middleware `logger` (`pino-http`)
  - маршрути нотаток винесені в `src/routes/notesRoutes.js`
  - контролери нотаток винесені в `src/controllers/notesController.js`
  - глобальний 404-middleware `notFoundHandler`
  - глобальний error-middleware `errorHandler` з підтримкою `http-errors`
- Модель `Note` (`src/models/note.js`):
  - `title` — обов’язковий рядок, `trim: true`
  - `content` — не обов’язковий рядок, `trim: true`, за замовчуванням порожній
  - `tag` — необов’язковий рядок з переліку:
    `Work | Personal | Meeting | Shopping | Ideas | Travel | Finance | Health | Important | Todo`
    (за замовчуванням `Todo`)
  - `timestamps: true`, `versionKey: false`
- CRUD-роути для нотаток:
  - `GET /notes` — повертає масив усіх нотаток
  - `GET /notes/:noteId` — повертає нотатку за `id` або 404 (`Note not found`)
  - `POST /notes` — створює нову нотатку, повертає 201 і створений об’єкт
  - `PATCH /notes/:noteId` — частково оновлює нотатку, повертає 200 або 404
  - `DELETE /notes/:noteId` — видаляє нотатку, повертає 200 або 404

## Файлова структура (скорочено)

```text
src/
  db/
    connectMongoDB.js
  middleware/
    logger.js
    notFoundHandler.js
    errorHandler.js
  models/
    note.js
  controllers/
    notesController.js
  routes/
    notesRoutes.js
  server.js
```

## Налаштування середовища

Створіть `.env` на основі `.env.example`:

```env
PORT=3000
MONGO_URL=your-mongodb-connection-string
NODE_ENV=development
```

- `PORT` — порт, на якому стартує сервер (за замовчуванням 3000).
- `MONGO_URL` — повний connection string до бази (наприклад, кластера Atlas з БД `notes`).
- `NODE_ENV` — використовується для вибору повідомлень у error-middleware.

## Скрипти

```bash
npm install
npm run dev   # запуск у режимі розробки (nodemon)
npm run start # запуск у продакшн-режимі
npm run lint  # перевірка ESLint
```

## Деплой

Для деплою на Render.com:

- створити сервіс типу `Web Service`
- вказати репозиторій і гілку `02-mongodb`
- у налаштуваннях додати змінні оточення `PORT` та `MONGO_URL`
- як стартову команду вказати:

```bash
npm install && npm run start
```
