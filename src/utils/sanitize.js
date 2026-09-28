/**
 * Strip password (and other sensitive fields) from a user object.
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

module.exports = { sanitizeUser };
