/**
 * Convert a numeric score (0–100) into a letter grade.
 */
const calculateGrade = (score) => {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
};

module.exports = { calculateGrade };
