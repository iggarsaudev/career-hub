const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", getProjects); // /api/projects
router.post("/", createProject); // /api/projects
router.put("/:id", updateProject); // /api/projects/:id
router.delete("/:id", deleteProject); // /api/projects/:id

module.exports = router;
