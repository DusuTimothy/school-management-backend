const { results, students, subjects, nextId } = require("../data/store");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { calculateGrade } = require("../utils/gradeCalculator");

const createResult = asyncHandler(async (req, res) => {
  const { studentId, subjectId, score, term, session } = req.body;

  const student = students.find((s) => s.id === studentId);
  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  const duplicate = results.find(
    (r) =>
      r.studentId === studentId &&
      r.subjectId === subjectId &&
      r.term === term &&
      r.session === session
  );
  if (duplicate) {
    throw new AppError(
      "A result for this student, subject, term and session already exists",
      409
    );
  }

  const result = {
    id: nextId.results++,
    studentId,
    subjectId,
    score,
    grade: calculateGrade(score),
    term,
    session,
    createdAt: new Date().toISOString(),
  };

  results.push(result);

  res.status(201).json({
    success: true,
    message: "Result created successfully",
    data: result,
  });
});

const getResults = asyncHandler(async (req, res) => {
  let data = results;

  // Students may only view their own results
  if (req.user.role === "student") {
    data = results.filter((r) => r.studentId === req.user.profileId);
  }

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

const getResultById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const result = results.find((r) => r.id === id);

  if (!result) {
    throw new AppError("Result not found", 404);
  }

  if (req.user.role === "student" && result.studentId !== req.user.profileId) {
    throw new AppError("Forbidden. You can only view your own results.", 403);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

const updateResult = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const result = results.find((r) => r.id === id);

  if (!result) {
    throw new AppError("Result not found", 404);
  }

  if (req.body.studentId != null) {
    const student = students.find((s) => s.id === req.body.studentId);
    if (!student) {
      throw new AppError("Student not found", 404);
    }
  }

  if (req.body.subjectId != null) {
    const subject = subjects.find((s) => s.id === req.body.subjectId);
    if (!subject) {
      throw new AppError("Subject not found", 404);
    }
  }

  Object.assign(result, req.body);

  if (req.body.score != null) {
    result.grade = calculateGrade(req.body.score);
  }

  result.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: "Result updated successfully",
    data: result,
  });
});

const deleteResult = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = results.findIndex((r) => r.id === id);

  if (index === -1) {
    throw new AppError("Result not found", 404);
  }

  const [removed] = results.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Result deleted successfully",
    data: removed,
  });
});

module.exports = {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
};
