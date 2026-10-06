# Chat Backend Assessment

Backend chat API built with Node.js, TypeScript, PostgreSQL, Prisma, and Firebase Firestore.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Firebase Firestore
- Zod

## Architecture

PostgreSQL stores:

- Users
- Chats
- Chat members

Firestore stores:

- Messages
- Read receipts
- Last seen message per user

## Setup

Install dependencies:

```bash
npm install
```

Create the environment file and fill in the Firebase values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default `4000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `FIREBASE_PROJECT_ID` | `project_id` from the Firebase service account key |
| `FIREBASE_CLIENT_EMAIL` | `client_email` from the Firebase service account key |
| `FIREBASE_PRIVATE_KEY` | `private_key` from the Firebase service account key, quoted, with `\n` kept as-is |

Start PostgreSQL (the default `DATABASE_URL` matches this container):

```bash
docker compose up -d
```

Apply migrations and generate the Prisma client:

```bash
npm run prisma:migrate
npm run prisma:generate
```

Run the server:

```bash
npm run dev
```

Or build and run the compiled output:

```bash
npm run build
npm start
```

The server runs at `http://localhost:4000`.

## Creating users

There is no user endpoint. Insert users directly into PostgreSQL:

```bash
docker exec -it chat-postgres psql -U postgres -d chat_db -c \
  "INSERT INTO \"User\" (id, name, email) VALUES (gen_random_uuid(), 'Alice', 'alice@example.com'), (gen_random_uuid(), 'Bob', 'bob@example.com') RETURNING id, name;"
```

Use the returned ids in the requests below.

## API

All request bodies are JSON. Ids are UUIDs.

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `GET` | `/` | – | Health check |
| `POST` | `/chat/create` | `{ userAId, userBId }` | Create a direct chat, or return the existing one |
| `POST` | `/chat/:chatId/message/send` | `{ senderId, text }` | Send a message (1–5000 characters) |
| `GET` | `/chat/:chatId/messages?limit=50` | – | List messages in a chat |
| `POST` | `/chat/:chatId/message/:messageId/read` | `{ userId }` | Mark a message as read |
| `POST` | `/chat/:chatId/lastseen` | `{ userId, messageId }` | Update the user's last seen message |
| `GET` | `/user/:userId/chats` | – | List a user's chats |

Example:

```bash
curl -X POST http://localhost:4000/chat/create \
  -H "Content-Type: application/json" \
  -d '{"userAId":"<uuid>","userBId":"<uuid>"}'

curl -X POST http://localhost:4000/chat/<chatId>/message/send \
  -H "Content-Type: application/json" \
  -d '{"senderId":"<uuid>","text":"Hello"}'
```

Successful responses have the shape `{ "success": true, ... }`.
