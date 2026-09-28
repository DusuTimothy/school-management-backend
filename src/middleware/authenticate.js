const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { users } = require("../data/store");

/**
 * Authentication middleware:
 * - Checks for Bearer JWT
 * - Verifies the token
 * - Attaches the authenticated user to req.user
 * - Rejects unauthenticated requests with 401
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required. Please provide a valid token.", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Authentication required. Please provide a valid token.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileId: user.profileId,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please log in again.", 401));
    }
    return next(new AppError("Invalid token.", 401));
  }
};

module.exports = { authenticate };
