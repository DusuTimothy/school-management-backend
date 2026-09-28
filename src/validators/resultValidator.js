const { z } = require("zod");

const TERMS = ["First", "Second", "Third"];

const createResultSchema = z.object({
  studentId: z
    .number({ required_error: "studentId is required" })
    .int()
    .positive("studentId must be a positive integer"),
  subjectId: z
    .number({ required_error: "subjectId is required" })
    .int()
    .positive("subjectId must be a positive integer"),
  score: z
    .number({ required_error: "Score is required" })
    .min(0, "Score must be between 0 and 100")
    .max(100, "Score must be between 0 and 100"),
  term: z.enum(TERMS, {
    errorMap: () => ({ message: "Term must be First, Second, or Third" }),
  }),
  session: z
    .string({ required_error: "Session is required" })
    .trim()
    .regex(/^\d{4}\/\d{4}$/, "Session must be in format YYYY/YYYY (e.g. 2024/2025)"),
});

const updateResultSchema = z
  .object({
    studentId: z.number().int().positive().optional(),
    subjectId: z.number().int().positive().optional(),
    score: z.number().min(0).max(100).optional(),
    term: z
      .enum(TERMS, {
        errorMap: () => ({ message: "Term must be First, Second, or Third" }),
      })
      .optional(),
    session: z
      .string()
      .trim()
      .regex(/^\d{4}\/\d{4}$/, "Session must be in format YYYY/YYYY")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

module.exports = {
  createResultSchema,
  updateResultSchema,
  TERMS,
};
