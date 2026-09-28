const { z } = require("zod");

const createSubjectSchema = z.object({
  name: z
    .string({ required_error: "Subject name is required" })
    .trim()
    .min(1, "Subject name is required")
    .max(100),
  code: z
    .string({ required_error: "Subject code is required" })
    .trim()
    .min(2, "Subject code must be at least 2 characters")
    .max(20)
    .toUpperCase(),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default(""),
});

const updateSubjectSchema = createSubjectSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

module.exports = {
  createSubjectSchema,
  updateSubjectSchema,
};
