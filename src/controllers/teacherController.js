const { teachers, nextId } = require("../data/store");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, phone, subject } = req.body;

  if (teachers.some((t) => t.email === email)) {
    throw new AppError("A teacher with this email already exists", 409);
  }

  const teacher = {
    id: nextId.teachers++,
    name,
    email,
    phone,
    subject,
    createdAt: new Date().toISOString(),
  };

  teachers.push(teacher);

  res.status(201).json({
    success: true,
    message: "Teacher created successfully",
    data: teacher,
  });
});

const getTeachers = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: teachers.length,
    data: teachers,
  });
});

const getTeacherById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

const updateTeacher = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }

  if (req.body.email && req.body.email !== teacher.email) {
    if (teachers.some((t) => t.email === req.body.email)) {
      throw new AppError("A teacher with this email already exists", 409);
    }
  }

  Object.assign(teacher, req.body, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    message: "Teacher updated successfully",
    data: teacher,
  });
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = teachers.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new AppError("Teacher not found", 404);
  }

  const [removed] = teachers.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Teacher deleted successfully",
    data: removed,
  });
});

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
