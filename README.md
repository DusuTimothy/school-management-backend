# School Management System API

Backend-only REST API built with **Node.js** and **Express.js**. Uses in-memory arrays (no real database) with JWT authentication, bcrypt password hashing, role-based authorization, validation, logging, and rate limiting.

## Features

- JWT authentication (`register` / `login`)
- Role-based access: **admin**, **teacher**, **student**
- CRUD for students, teachers, classes, subjects, and results
- Input validation with Zod
- Global error handling
- Request logging (method, URL, status, timestamp)
- Rate limiting (stricter on auth routes)
- Helmet + CORS security headers

## Project Structure

```
src/
├── controllers/     # Route handlers
├── routes/          # Express routers
├── middleware/      # Auth, authorize, validate, logger, errors, rate limit
├── validators/      # Zod schemas
├── utils/           # Helpers (AppError, grade calculator, sanitize)
├── data/            # In-memory store (users, students, teachers, …)
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Prerequisites

- Node.js 18+ recommended
- npm

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# 3. Start the server
npm start

# Or with auto-reload during development
npm run dev
```

Server runs at `http://localhost:3000` by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret for signing JWTs | — (required) |
| `JWT_EXPIRES_IN` | Token expiry | `1h` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor | `10` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window | `900000` (15 min) |
| `AUTH_RATE_LIMIT` | Max auth requests per window | `10` |
| `API_RATE_LIMIT` | Max API requests per window | `100` |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@school.com` | `Admin@123` |
| Teacher | `teacher@school.com` | `Teacher@123` |
| Student | `student@school.com` | `Student@123` |

## API Endpoints

### Auth

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Students

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/students` | Admin |
| GET | `/api/students` | Admin, Teacher, Student (own) |
| GET | `/api/students/:id` | Admin, Teacher, Student (own) |
| PUT | `/api/students/:id` | Admin |
| DELETE | `/api/students/:id` | Admin |

### Teachers

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/teachers` | Admin |
| GET | `/api/teachers` | Admin |
| GET | `/api/teachers/:id` | Admin |
| PUT | `/api/teachers/:id` | Admin |
| DELETE | `/api/teachers/:id` | Admin |

### Classes

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/classes` | Admin |
| GET | `/api/classes` | Admin, Teacher, Student (own) |
| GET | `/api/classes/:id` | Admin, Teacher, Student (own) |
| PUT | `/api/classes/:id` | Admin |
| DELETE | `/api/classes/:id` | Admin |

### Subjects

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/subjects` | Admin |
| GET | `/api/subjects` | Admin, Teacher, Student |
| GET | `/api/subjects/:id` | Admin, Teacher, Student |
| PUT | `/api/subjects/:id` | Admin |
| DELETE | `/api/subjects/:id` | Admin |

### Results

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/results` | Admin, Teacher |
| GET | `/api/results` | Admin, Teacher, Student (own) |
| GET | `/api/results/:id` | Admin, Teacher, Student (own) |
| PUT | `/api/results/:id` | Admin, Teacher |
| DELETE | `/api/results/:id` | Admin |

## Role Permissions Summary

**Admin** — full create / view / update / delete on students, teachers, classes, subjects, and results.

**Teacher** — view students, classes, subjects; create / view / update results. Cannot delete students or teachers, or manage admins.

**Student** — view own profile, own class, subjects, and own results. Cannot create, update, or delete school records.

## Authentication

Send the JWT in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

### Register example

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Student",
    "email": "new@school.com",
    "phone": "08099999999",
    "password": "Pass123",
    "role": "student"
  }'
```

### Login example

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "Admin@123"
  }'
```

## Error Responses

Unauthenticated:

```json
{ "success": false, "message": "Authentication required. Please provide a valid token." }
```

Forbidden:

```json
{ "success": false, "message": "Forbidden. You do not have permission to perform this action." }
```

Not found:

```json
{ "success": false, "message": "Student not found" }
```

Validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email format" }]
}
```

## Grading Scale

| Score | Grade |
|-------|-------|
| 70–100 | A |
| 60–69 | B |
| 50–59 | C |
| 40–49 | D |
| 0–39 | F |

## Postman / Thunder Client

Import `postman/School_Management_API.postman_collection.json` into Postman or Thunder Client.

1. Run **Auth → Login (Admin)** (or Teacher / Student).
2. Copy the returned `token` into the collection variable `token` (or use the test script that sets it automatically).
3. Call protected endpoints.

## Notes

- Data is stored in memory and resets when the server restarts.
- Passwords are hashed with bcrypt and never returned in responses.
- No frontend and no real database by design.
# school-management-backend
