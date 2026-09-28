const { subjects, nextId } = require("../data/store");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createSubject = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;

  if (subjects.some((s) => s.code === code)) {
    throw new AppError("A subject with this code already exists", 409);
  }

  const subject = {
    id: nextId.subjects++,
    name,
    code,
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  subjects.push(subject);

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: subject,
  });
});

const getSubjects = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

const getSubjectById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const subject = subjects.find((s) => s.id === id);

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  res.status(200).json({
    success: true,
    data: subject,
  });
});

const updateSubject = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const subject = subjects.find((s) => s.id === id);

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  if (req.body.code && req.body.code !== subject.code) {
    if (subjects.some((s) => s.code === req.body.code)) {
      throw new AppError("A subject with this code already exists", 409);
    }
  }

  Object.assign(subject, req.body, { updatedAt: new Date().toISOString() });

  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    data: subject,
  });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = subjects.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new AppError("Subject not found", 404);
  }

  const [removed] = subjects.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Subject deleted successfully",
    data: removed,
  });
});

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
