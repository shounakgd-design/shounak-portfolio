const express = require("express");
const Blog = require("../models/Blog");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
});

// GET single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
});

// CREATE blog
router.post("/", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
});

// UPDATE blog
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
});

// DELETE blog
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
});

module.exports = router;

