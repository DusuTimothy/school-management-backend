const express = require("express");
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { idParamSchema } = require("../validators/studentValidator");
const {
  createSubjectSchema,
  updateSubjectSchema,
} = require("../validators/subjectValidator");

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("admin"), validate(createSubjectSchema), createSubject);
router.get("/", authorize("admin", "teacher", "student"), getSubjects);
router.get(
  "/:id",
  authorize("admin", "teacher", "student"),
  validate(idParamSchema, "params"),
  getSubjectById
);
router.put(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateSubjectSchema),
  updateSubject
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  deleteSubject
);

module.exports = router;
