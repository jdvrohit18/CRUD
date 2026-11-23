const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

// 1. CREATE BLOG
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      author: req.user.id
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// 2. READ ALL BLOGS
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// 3. READ SINGLE BLOG
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// 4. UPDATE BLOG
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You cannot edit this blog"
      });
    }

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// 5. DELETE BLOG
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You cannot delete this blog"
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Blog deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;