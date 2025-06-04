const Blog = require("../models/blogs.js");
module.exports.index = async (req, res) => {
  let blogs = await Blog.find({}).populate("author");
  res.render("blogs/index.ejs", { blogs });
};

module.exports.renderNewForm = (req, res) => {
  res.render("blogs/new.ejs");
};

module.exports.createBlog = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let { blog } = req.body;
  let newBlog = new Blog(blog);
  newBlog.author = req.user._id;
  newBlog.image = { url, filename };
  await newBlog.save();
  req.flash("success", "New Blog Created");
  res.redirect("/blogs");
};

module.exports.showBlog = async (req, res) => {
  let { id } = req.params;
  let blog = await Blog.findById(id)
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    })
    .populate("author");
  if (!blog) {
    req.flash("error", "Blog does not exist!");
    res.redirect("/blogs");
  } else {
    res.render("blogs/show.ejs", { blog });
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let blog = await Blog.findById(id);
  if (!blog) {
    req.flash("error", "Blog does not exist!");
    res.redirect("/blogs");
  }
  let originalImageUrl = blog.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("blogs/edit.ejs", { blog, originalImageUrl });
};

module.exports.editBlog = async (req, res) => {
  let { id } = req.params;
  let { blog } = req.body;
  let updatedblog = await Blog.findByIdAndUpdate(id, blog);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedblog.image = { url, filename };
    await updatedblog.save();
  }
  req.flash("success", "Blog Updated");
  res.redirect(`/blogs/${id}`);
};

module.exports.deleteBlog = async (req, res) => {
  let { id } = req.params;
  await Blog.findByIdAndDelete(id);
  req.flash("success", "Blog Deleted");
  res.redirect("/blogs");
};

module.exports.search = async (req, res) => {
  const { q } = req.query;

  // Redirect to the listings index if the search query is empty or missing
  if (!q || q.trim() === "") {
    return res.redirect("/blogs");
  }

  try {
    const regex = new RegExp(q, "i"); // Case-insensitive regular expression

    // Query the database using MongoDB's $or operator for multiple fields
    const blogs = await Blog.find({}).populate("author", "username"); // or "name", depending on your User schema

    const filteredBlogs = blogs.filter(
      (blog) =>
        regex.test(blog.title) ||
        regex.test(blog.content) ||
        regex.test(blog.author.username)
    );
    if (filteredBlogs.length == 0) {
      req.flash("error", "No blog found");
      res.redirect("/blogs");
    } else {
      res.render("blogs/index.ejs", { blogs: filteredBlogs });
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Internal Server Error");
  }
};
