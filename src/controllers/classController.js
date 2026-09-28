const { classes, teachers, students, nextId } = require("../data/store");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createClass = asyncHandler(async (req, res) => {
  const { name, level, teacherId } = req.body;

  if (classes.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new AppError("A class with this name already exists", 409);
  }

  if (teacherId != null) {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found for the given teacherId", 404);
    }
  }

  const newClass = {
    id: nextId.classes++,
    name,
    level,
    teacherId: teacherId ?? null,
    createdAt: new Date().toISOString(),
  };

  classes.push(newClass);

  res.status(201).json({
    success: true,
    message: "Class created successfully",
    data: newClass,
  });
});

const getClasses = asyncHandler(async (req, res) => {
  // Students may only view their own class
  if (req.user.role === "student") {
    const student = students.find((s) => s.id === req.user.profileId);
    if (!student) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    const ownClasses = classes.filter(
      (c) => c.id === student.classId || c.name === student.class
    );
    return res.status(200).json({
      success: true,
      count: ownClasses.length,
      data: ownClasses,
    });
  }

  res.status(200).json({
    success: true,
    count: classes.length,
    data: classes,
  });
});

const getClassById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const classItem = classes.find((c) => c.id === id);

  if (!classItem) {
    throw new AppError("Class not found", 404);
  }

  if (req.user.role === "student") {
    const student = students.find((s) => s.id === req.user.profileId);
    const allowed =
      student &&
      (student.classId === id || student.class === classItem.name);
    if (!allowed) {
      throw new AppError("Forbidden. You can only view your own class.", 403);
    }
  }

  res.status(200).json({
    success: true,
    data: classItem,
  });
});

const updateClass = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const classItem = classes.find((c) => c.id === id);

  if (!classItem) {
    throw new AppError("Class not found", 404);
  }

  if (req.body.name && req.body.name.toLowerCase() !== classItem.name.toLowerCase()) {
    if (classes.some((c) => c.name.toLowerCase() === req.body.name.toLowerCase())) {
      throw new AppError("A class with this name already exists", 409);
    }
  }

  if (req.body.teacherId != null) {
    const teacher = teachers.find((t) => t.id === req.body.teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found for the given teacherId", 404);
    }
  }

  Object.assign(classItem, req.body, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    message: "Class updated successfully",
    data: classItem,
  });
});

const deleteClass = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = classes.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new AppError("Class not found", 404);
  }

  const [removed] = classes.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Class deleted successfully",
    data: removed,
  });
});

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};
