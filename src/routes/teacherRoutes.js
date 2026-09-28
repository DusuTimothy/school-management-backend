const express = require("express");
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { idParamSchema } = require("../validators/studentValidator");
const {
  createTeacherSchema,
  updateTeacherSchema,
} = require("../validators/teacherValidator");

const router = express.Router();

router.use(authenticate);

// Teachers list/detail: admin only (teachers should not manage other teachers/admins)
router.post("/", authorize("admin"), validate(createTeacherSchema), createTeacher);
router.get("/", authorize("admin"), getTeachers);
router.get(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  getTeacherById
);
router.put(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateTeacherSchema),
  updateTeacher
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  deleteTeacher
);

module.exports = router;
