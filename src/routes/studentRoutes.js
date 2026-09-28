const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const {
  idParamSchema,
  createStudentSchema,
  updateStudentSchema,
} = require("../validators/studentValidator");

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("admin"), validate(createStudentSchema), createStudent);
router.get("/", authorize("admin", "teacher", "student"), getStudents);
router.get(
  "/:id",
  authorize("admin", "teacher", "student"),
  validate(idParamSchema, "params"),
  getStudentById
);
router.put(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateStudentSchema),
  updateStudent
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  deleteStudent
);

module.exports = router;
