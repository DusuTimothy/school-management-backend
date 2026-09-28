const { students, classes, nextId } = require("../data/store");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, class: className, classId } = req.body;

  if (students.some((s) => s.email === email)) {
    throw new AppError("A student with this email already exists", 409);
  }

  if (classId != null) {
    const classExists = classes.find((c) => c.id === classId);
    if (!classExists) {
      throw new AppError("Class not found for the given classId", 404);
    }
  }

  const student = {
    id: nextId.students++,
    name,
    email,
    phone,
    class: className,
    classId: classId ?? null,
    createdAt: new Date().toISOString(),
  };

  students.push(student);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: student,
  });
});

const getStudents = asyncHandler(async (req, res) => {
  // Students may only see their own profile via the list endpoint
  if (req.user.role === "student") {
    const own = students.filter((s) => s.id === req.user.profileId);
    return res.status(200).json({
      success: true,
      count: own.length,
      data: own,
    });
  }

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

const getStudentById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  // Students can only view their own profile
  if (req.user.role === "student" && req.user.profileId !== id) {
    throw new AppError("Forbidden. You can only view your own profile.", 403);
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  if (req.body.email && req.body.email !== student.email) {
    if (students.some((s) => s.email === req.body.email)) {
      throw new AppError("A student with this email already exists", 409);
    }
  }

  if (req.body.classId != null) {
    const classExists = classes.find((c) => c.id === req.body.classId);
    if (!classExists) {
      throw new AppError("Class not found for the given classId", 404);
    }
  }

  Object.assign(student, req.body, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new AppError("Student not found", 404);
  }

  const [removed] = students.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: removed,
  });
});

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
