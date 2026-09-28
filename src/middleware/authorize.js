const AppError = require("../utils/AppError");

/**
 * Authorization middleware — restrict access to the given roles.
 * Returns 403 when the authenticated user lacks permission.
 *
 * Usage: authorize("admin") or authorize("admin", "teacher")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden. You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};

module.exports = { authorize };
