const { z } = require("zod");

const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a valid positive integer")
    .transform(Number)
    .refine((n) => n > 0, "ID must be a positive integer"),
});

const createStudentSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email format")
    .toLowerCase(),
  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  class: z
    .string({ required_error: "Class is required" })
    .trim()
    .min(1, "Class is required"),
  classId: z
    .number({ required_error: "classId is required" })
    .int()
    .positive("classId must be a positive integer")
    .optional(),
});

const updateStudentSchema = createStudentSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

module.exports = {
  idParamSchema,
  createStudentSchema,
  updateStudentSchema,
};
