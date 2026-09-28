/**
 * In-memory data store simulating a database.
 * Entities are related by IDs (students ↔ classes, results ↔ students/subjects, etc.).
 */

const users = [
  {
    id: 1,
    name: "System Admin",
    email: "admin@school.com",
    phone: "08011111111",
    role: "admin",
    password: "$2b$10$VT9OdAudZ9wM6cLjei8IWu5RIq3HhZIw9XL2HDIlRXz8ltyK5f.WO", // Admin@123
    profileId: null,
    createdAt: "2025-01-01T08:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Teacher",
    email: "teacher@school.com",
    phone: "08022222222",
    role: "teacher",
    password: "$2b$10$loNUIzCdFQdyutnxf2hNcuOKjpecAOoqcNuBF2OmuyftGSCF9.AaO", // Teacher@123
    profileId: 1,
    createdAt: "2025-01-02T08:00:00.000Z",
  },
  {
    id: 3,
    name: "John Student",
    email: "student@school.com",
    phone: "08033333333",
    role: "student",
    password: "$2b$10$SZiFcxyW/EenMmIxNQTiLeYu6R3czxDiazr/h8m2kXXX2k3irlmm2", // Student@123
    profileId: 1,
    createdAt: "2025-01-03T08:00:00.000Z",
  },
];

const classes = [
  {
    id: 1,
    name: "JSS 1A",
    level: "Junior Secondary",
    teacherId: 1,
    createdAt: "2025-01-05T08:00:00.000Z",
  },
  {
    id: 2,
    name: "SSS 2B",
    level: "Senior Secondary",
    teacherId: 2,
    createdAt: "2025-01-05T09:00:00.000Z",
  },
];

const teachers = [
  {
    id: 1,
    name: "Jane Teacher",
    email: "teacher@school.com",
    phone: "08022222222",
    subject: "Mathematics",
    createdAt: "2025-01-02T08:00:00.000Z",
  },
  {
    id: 2,
    name: "Mark Science",
    email: "mark.science@school.com",
    phone: "08044444444",
    subject: "Physics",
    createdAt: "2025-01-04T08:00:00.000Z",
  },
];

const students = [
  {
    id: 1,
    name: "John Student",
    email: "student@school.com",
    phone: "08033333333",
    class: "JSS 1A",
    classId: 1,
    createdAt: "2025-01-03T08:00:00.000Z",
  },
  {
    id: 2,
    name: "Mary Learner",
    email: "mary@school.com",
    phone: "08055555555",
    class: "SSS 2B",
    classId: 2,
    createdAt: "2025-01-06T08:00:00.000Z",
  },
];

const subjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MTH101",
    description: "Basic algebra and arithmetic",
    createdAt: "2025-01-05T10:00:00.000Z",
  },
  {
    id: 2,
    name: "English Language",
    code: "ENG101",
    description: "Grammar and comprehension",
    createdAt: "2025-01-05T10:30:00.000Z",
  },
  {
    id: 3,
    name: "Physics",
    code: "PHY201",
    description: "Mechanics and energy",
    createdAt: "2025-01-05T11:00:00.000Z",
  },
];

const results = [
  {
    id: 1,
    studentId: 1,
    subjectId: 1,
    score: 85,
    grade: "A",
    term: "First",
    session: "2024/2025",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: 2,
    studentId: 1,
    subjectId: 2,
    score: 72,
    grade: "B",
    term: "First",
    session: "2024/2025",
    createdAt: "2025-02-01T09:00:00.000Z",
  },
  {
    id: 3,
    studentId: 2,
    subjectId: 3,
    score: 64,
    grade: "C",
    term: "First",
    session: "2024/2025",
    createdAt: "2025-02-02T08:00:00.000Z",
  },
];

const nextId = {
  users: 4,
  students: 3,
  teachers: 3,
  classes: 3,
  subjects: 4,
  results: 4,
};

module.exports = {
  users,
  students,
  teachers,
  classes,
  subjects,
  results,
  nextId,
};
