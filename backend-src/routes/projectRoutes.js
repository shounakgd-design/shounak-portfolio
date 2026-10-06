const express = require("express");
const Project = require("../models/Project");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
});

// GET single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
});

// CREATE project
router.post("/", requireAdmin, async (req, res) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// UPDATE project
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
});

// DELETE project
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
});

module.exports = router;
