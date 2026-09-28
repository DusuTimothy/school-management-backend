const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users, students, teachers, nextId } = require("../data/store");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("../utils/sanitize");

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const existing = users.find((u) => u.email === email);
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let profileId = null;

  // Auto-create a linked student/teacher profile for those roles
  if (role === "student") {
    const student = {
      id: nextId.students++,
      name,
      email,
      phone,
      class: "Unassigned",
      classId: null,
      createdAt: new Date().toISOString(),
    };
    students.push(student);
    profileId = student.id;
  } else if (role === "teacher") {
    const teacher = {
      id: nextId.teachers++,
      name,
      email,
      phone,
      subject: "Unassigned",
      createdAt: new Date().toISOString(),
    };
    teachers.push(teacher);
    profileId = teacher.id;
  }

  const newUser = {
    id: nextId.users++,
    name,
    email,
    phone,
    role,
    password: hashedPassword,
    profileId,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: sanitizeUser(newUser),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      profileId: user.profileId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
});

module.exports = { register, login };
