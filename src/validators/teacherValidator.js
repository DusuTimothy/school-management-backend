const { z } = require("zod");

const createTeacherSchema = z.object({
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
  subject: z
    .string({ required_error: "Subject is required" })
    .trim()
    .min(1, "Subject is required"),
});

const updateTeacherSchema = createTeacherSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

module.exports = {
  createTeacherSchema,
  updateTeacherSchema,
};
