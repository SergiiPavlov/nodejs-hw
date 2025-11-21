# AGENT brief for Codex / AI reviewer

## Project

Node.js homework **02-mongodb** — Express backend for a notes collection with MongoDB (Mongoose).

Repository name: `nodejs-hw`  
Expected working branch: `02-mongodb`  

This homework is a continuation of `01-express`, але тепер з реальною базою даних MongoDB та правильною структурою коду.

## Goals

- Тримати проєкт повністю у відповідності до вимог ДЗ-02:
  - сервер на Express з окремими шарами:
    - підключення до БД (`src/db/connectMongoDB.js`)
    - middleware (`src/middleware/*`)
    - моделі (`src/models/*`)
    - контролери (`src/controllers/*`)
    - роутери (`src/routes/*`)
  - підключення до MongoDB через Mongoose із рядком підключення в `MONGO_URL`
  - використання `pino-http` для логування
  - реалізовані всі 5 CRUD-операцій для нотаток:
    - `GET /notes`
    - `GET /notes/:noteId`
    - `POST /notes`
    - `PATCH /notes/:noteId`
    - `DELETE /notes/:noteId`
  - коректна обробка 404 та помилок через `http-errors`
- Зберігати код максимально простим і читабельним для початківця.
- Не ламати те, що вже працює, при рефакторингу.

## Tech stack / libraries

- Node.js (ESM)
- Express
- Mongoose
- pino-http + pino-pretty
- http-errors
- cors
- dotenv
- ESLint + Prettier (базове налаштування)

## Structure

Ключові файли:

- `src/server.js`
  - підключає `dotenv/config`, `express`, `cors`
  - реєструє глобальні middleware:
    - `logger` (pino-http)
    - `express.json()`
    - `cors()`
  - реєструє роутер нотаток: `app.use(notesRoutes)`
  - після роутів — `notFoundHandler`, потім `errorHandler`
  - **до** старту сервера викликає `await connectMongoDB()`
- `src/db/connectMongoDB.js`
  - експорт `connectMongoDB()`
  - читає `process.env.MONGO_URL`
  - на успіх → логує `✅ MongoDB connection established successfully`
  - на помилку → логує і викликає `process.exit(1)`
- `src/middleware/logger.js`
  - експорт `logger` з `pino-http` + `pino-pretty`
- `src/middleware/notFoundHandler.js`
  - повертає 404 з JSON `{ "message": "Route not found" }`
- `src/middleware/errorHandler.js`
  - імпортує `HttpError` з `http-errors`
  - якщо `err instanceof HttpError` → повертає `err.status` і `{ message: err.message || err.name }`
  - інакше:
    - якщо `NODE_ENV === "production"` → 500 + загальне повідомлення
    - інакше → 500 + `err.message`
- `src/models/note.js`
  - Mongoose-модель `Note` з полями:
    - `title: String`, `required: true`, `trim: true`
    - `content: String`, `trim: true`, `default: ""`
    - `tag: String`, `enum` з:
      `Work | Personal | Meeting | Shopping | Ideas | Travel | Finance | Health | Important | Todo`,
      `default: "Todo"`, `trim: true`
    - опції: `timestamps: true`, `versionKey: false`
- `src/controllers/notesController.js`
  - `getAllNotes(req, res)`
    - `Note.find()` → 200 + масив нотаток
  - `getNoteById(req, res, next)`
    - `Note.findById(noteId)`
    - якщо немає → `next(createHttpError(404, "Note not found"))`
    - інакше → 200 + об’єкт
  - `createNote(req, res)`
    - `Note.create(req.body)` → 201 + створений документ
  - `deleteNote(req, res, next)`
    - `Note.findOneAndDelete({ _id: noteId })`
    - якщо немає → 404 через `createHttpError`
    - інакше → 200 + видалений документ
  - `updateNote(req, res, next)`
    - `Note.findOneAndUpdate({ _id: noteId }, req.body, { new: true })`
    - якщо немає → 404 через `createHttpError`
    - інакше → 200 + оновлений документ
- `src/routes/notesRoutes.js`
  - реєструє всі 5 CRUD-роутів:
    - `GET /notes`
    - `GET /notes/:noteId`
    - `POST /notes`
    - `PATCH /notes/:noteId`
    - `DELETE /notes/:noteId`
  - **Важливо:** префікс `/notes` лишається тут, а не в `server.js`.

## ENV

Файл `.env` (на основі `.env.example`):

```env
PORT=3000
MONGO_URL=your-mongodb-connection-string
NODE_ENV=development
```

Важливо **не** комітити `.env` у репозиторій; використовувати `.env.example` як шаблон.

## When making changes

- Не змінювати назви контролерів, роутів та полів у схемі, які вимагає ТЗ:
  - назви експортів у `notesController.js`: `getAllNotes`, `getNoteById`, `createNote`, `deleteNote`, `updateNote`
  - маршрутні шляхи: `/notes`, `/notes/:noteId`
- Не додавати зайві роутери чи бізнес-логіку, яка не потрібна для цього ДЗ (якщо користувач явно не просить).
- Памʼятати про порядок middleware:
  1. `logger`
  2. `express.json()`
  3. `cors()`
  4. роутери
  5. `notFoundHandler`
  6. `errorHandler`
- Якщо вносяться зміни:
  - не ламати існуючі відповіді та статус-коди;
  - не видаляти існуючі файли `db/`, `middleware/`, `models/`, `controllers/`, `routes/` без важливої причини.

## Output format for reviews

Коли коментуєш PR, будь ласка:

- групуй зауваження за категоріями: `logic`, `requirements`, `structure`, `style`, `DX`;
- для кожної проблеми:
  - покажи **поточний код** (короткий фрагмент),
  - запропонуй **виправлений код**,
  - коротко (1–2 речення) поясни, *чому* зміна потрібна з точки зору ДЗ або кращої практики.
