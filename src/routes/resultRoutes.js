const express = require("express");
const {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");
const { authenticate } = require("../middleware/authenticate");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { idParamSchema } = require("../validators/studentValidator");
const {
  createResultSchema,
  updateResultSchema,
} = require("../validators/resultValidator");

const router = express.Router();

router.use(authenticate);

// Admin: full manage; Teacher: create/view/update; Student: view own
router.post("/", authorize("admin", "teacher"), validate(createResultSchema), createResult);
router.get("/", authorize("admin", "teacher", "student"), getResults);
router.get(
  "/:id",
  authorize("admin", "teacher", "student"),
  validate(idParamSchema, "params"),
  getResultById
);
router.put(
  "/:id",
  authorize("admin", "teacher"),
  validate(idParamSchema, "params"),
  validate(updateResultSchema),
  updateResult
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(idParamSchema, "params"),
  deleteResult
);

module.exports = router;
