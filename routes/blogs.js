const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Blog = require("../models/blogs.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validateBlog } = require("../middleware.js");
const Controller = require("../controllers/blogs.js");
const multer = require("multer");
const { storage} = require("../cloudConfig.js");
const upload = multer({storage});


// Index Route
router.get(
  "/",
  wrapAsync(Controller.index)
);

// New Route
router.get("/new", isLoggedIn, Controller.renderNewForm);
router.get("/search", Controller.search);
// Create Route
router.post(
  "/",
  isLoggedIn,
  upload.single('blog[image]'),
  validateBlog,
  wrapAsync(Controller.createBlog)
);

// Show Route
router.get(
  "/:id",
  wrapAsync(Controller.showBlog)
);


// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(Controller.renderEditForm)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  upload.single('blog[image]'),
  validateBlog,
  wrapAsync(Controller.editBlog)
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(Controller.deleteBlog)
);



module.exports = router;
