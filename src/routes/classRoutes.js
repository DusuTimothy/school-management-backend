const express = require("express");
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { idParamSchema } = require("../validators/studentValidator");
const {
  createClassSchema,
  updateClassSchema,
} = require("../validators/classValidator");

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("admin"), validate(createClassSchema), createClass);
router.get("/", authorize("admin", "teacher", "student"), getClasses);
router.get(
  "/:id",
  authorize("admin", "teacher", "student"),
  validate(idParamSchema, "params"),
  getClassById
);
router.put(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateClassSchema),
  updateClass
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  deleteClass
);

module.exports = router;
