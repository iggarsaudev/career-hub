const express = require("express");
const router = express.Router();
const {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} = require("../controllers/languageController");

router.get("/", getLanguages);
router.post("/", createLanguage);
router.put("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);

module.exports = router;
