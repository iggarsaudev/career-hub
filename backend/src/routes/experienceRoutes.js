const express = require("express");
const router = express.Router();
const {
  getExperiences,
  createExperience,
  deleteExperience,
} = require("../controllers/experienceController");

router.get("/", getExperiences);
router.post("/", createExperience);
router.delete("/:id", deleteExperience);

module.exports = router;
