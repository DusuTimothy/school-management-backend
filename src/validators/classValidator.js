const { z } = require("zod");

const createClassSchema = z.object({
  name: z
    .string({ required_error: "Class name is required" })
    .trim()
    .min(1, "Class name is required")
    .max(50),
  level: z
    .string({ required_error: "Level is required" })
    .trim()
    .min(1, "Level is required"),
  teacherId: z
    .number()
    .int()
    .positive("teacherId must be a positive integer")
    .optional()
    .nullable(),
});

const updateClassSchema = createClassSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

module.exports = {
  createClassSchema,
  updateClassSchema,
};
