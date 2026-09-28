# Thunder Client test inputs

Use these requests with the API running locally. The examples follow the seeded data in `src/data/store.js`.

## Setup

1. Start the server with `npm run dev` or `npm start`.
2. In Thunder Client, create an environment with:

   | Variable | Value |
   |---|---|
   | `baseUrl` | `http://localhost:3000` |
   | `token` | *(leave empty until you log in)* |

3. For every protected request, add this header:

   | Header | Value |
   |---|---|
   | `Authorization` | `Bearer {{token}}` |

4. For requests with JSON bodies, add `Content-Type: application/json`.
5. Log in with the relevant account and copy `data.token` from the response into `token`. Replace it when switching roles.

Seeded accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@school.com` | `Admin@123` |
| Teacher | `teacher@school.com` | `Teacher@123` |
| Student | `student@school.com` | `Student@123` |

## Health

### API root

- **GET** `{{baseUrl}}/`
- No body or authorization required.

## Authentication

### Register a student

- **POST** `{{baseUrl}}/api/auth/register`
- No authorization required.

```json
{
  "name": "Test Student",
  "email": "test.student@school.com",
  "phone": "08077777777",
  "password": "Test123",
  "role": "student"
}
```

Use a new email if you repeat this request.

### Register validation error

- **POST** `{{baseUrl}}/api/auth/register`
- No authorization required. Expected: validation error.

```json
{
  "name": "A",
  "email": "not-an-email",
  "phone": "123",
  "password": "abc"
}
```

### Log in

- **POST** `{{baseUrl}}/api/auth/login`
- No authorization required.
- To test a role, use the corresponding email/password from the seeded accounts above.

```json
{
  "email": "admin@school.com",
  "password": "Admin@123"
}
```

The response includes `data.token`. Copy it to the `token` environment variable before sending protected requests. To test teacher/student permissions, repeat with their credentials and replace `token`.

### Invalid login

- **POST** `{{baseUrl}}/api/auth/login`
- No authorization required. Expected: authentication error.

```json
{
  "email": "admin@school.com",
  "password": "WrongPass1"
}
```

## Students

Use the admin token for create, update, and delete. A student token can view that student's own record.

### Create student

- **POST** `{{baseUrl}}/api/students`
- Admin token required.

```json
{
  "name": "Ada Lovelace",
  "email": "ada@school.com",
  "phone": "08088888888",
  "class": "JSS 1A",
  "classId": 1
}
```

### List and retrieve students

- **GET** `{{baseUrl}}/api/students` — admin/teacher; student sees own record.
- **GET** `{{baseUrl}}/api/students/1` — retrieve seeded student John Student.
- Admin, teacher, or student token required (students can access only their own record).
- No body.

### Update student

- **PUT** `{{baseUrl}}/api/students/1`
- Admin token required.

```json
{
  "phone": "08012345678",
  "class": "SSS 2B",
  "classId": 2
}
```

### Delete student

- **DELETE** `{{baseUrl}}/api/students/2`
- Admin token required. Run destructive tests last.
- No body.

### Unauthorized / forbidden checks

- **GET** `{{baseUrl}}/api/students` with no Authorization header — expected `401`.
- **POST** `{{baseUrl}}/api/students` with a student token — expected `403`.

```json
{
  "name": "Hacker",
  "email": "hack@school.com",
  "phone": "08000000000",
  "class": "JSS 1A"
}
```

## Teachers

Admin token required for these requests.

### Create teacher

- **POST** `{{baseUrl}}/api/teachers`

```json
{
  "name": "Sara Biology",
  "email": "sara@school.com",
  "phone": "08066666666",
  "subject": "Biology"
}
```

### List and retrieve teachers

- **GET** `{{baseUrl}}/api/teachers`
- **GET** `{{baseUrl}}/api/teachers/1` — retrieve seeded teacher Jane Teacher.
- No body.

### Update teacher

- **PUT** `{{baseUrl}}/api/teachers/1`

```json
{
  "subject": "Further Mathematics"
}
```

### Delete teacher

- **DELETE** `{{baseUrl}}/api/teachers/2`
- No body. Run destructive tests last.

### Forbidden check

- **DELETE** `{{baseUrl}}/api/teachers/1` with a teacher token — expected `403`.
- No body.

## Classes

Admin token required for create, update, and delete. Admin, teacher, or student token can list/retrieve classes (students see their own class).

### Create class

- **POST** `{{baseUrl}}/api/classes`

```json
{
  "name": "JSS 2A",
  "level": "Junior Secondary",
  "teacherId": 1
}
```

### List and retrieve classes

- **GET** `{{baseUrl}}/api/classes`
- **GET** `{{baseUrl}}/api/classes/1` — retrieve seeded class JSS 1A.
- No body.

### Update class

- **PUT** `{{baseUrl}}/api/classes/1`

```json
{
  "level": "Junior Secondary School"
}
```

### Delete class

- **DELETE** `{{baseUrl}}/api/classes/2`
- No body. Run destructive tests last.

## Subjects

Admin token required for create, update, and delete. Admin, teacher, or student token can list/retrieve subjects.

### Create subject

- **POST** `{{baseUrl}}/api/subjects`

```json
{
  "name": "Chemistry",
  "code": "CHM201",
  "description": "Organic and inorganic chemistry"
}
```

### List and retrieve subjects

- **GET** `{{baseUrl}}/api/subjects`
- **GET** `{{baseUrl}}/api/subjects/1` — retrieve seeded subject Mathematics.
- No body.

### Update subject

- **PUT** `{{baseUrl}}/api/subjects/1`

```json
{
  "description": "Updated mathematics syllabus"
}
```

### Delete subject

- **DELETE** `{{baseUrl}}/api/subjects/3`
- No body. Run destructive tests last.

## Results

Admin or teacher token required for create/update. Admin, teacher, or student token can list/retrieve results (students see their own results). Only admin can delete.

### Create result

- **POST** `{{baseUrl}}/api/results`
- Use an admin or teacher token.

```json
{
  "studentId": 1,
  "subjectId": 1,
  "score": 88,
  "term": "Second",
  "session": "2024/2025"
}
```

### List and retrieve results

- **GET** `{{baseUrl}}/api/results`
- **GET** `{{baseUrl}}/api/results/1`
- No body. Use a student token to check that only the student's own results are returned.

### Update result

- **PUT** `{{baseUrl}}/api/results/1`
- Use an admin or teacher token.

```json
{
  "score": 91
}
```

### Delete result

- **DELETE** `{{baseUrl}}/api/results/3`
- Admin token required. Run destructive tests last.
- No body.

### Validation error: score out of range

- **POST** `{{baseUrl}}/api/results`
- Use an admin or teacher token. Expected: validation error.

```json
{
  "studentId": 1,
  "subjectId": 1,
  "score": 150,
  "term": "First",
  "session": "2024/2025"
}
```

### Forbidden check

- **DELETE** `{{baseUrl}}/api/results/1` with a teacher token — expected `403`.
- No body.

### Not found check

- **GET** `{{baseUrl}}/api/results/9999`
- Use any authorized token. Expected: not found.
- No body.

## Notes

- The API uses in-memory data. Restarting the server restores the seeded records and IDs.
- Create requests may fail on a second run when the email or code is already present; use a fresh unique value or restart the server.
- Try delete requests last because they remove seeded records for the current server process.
