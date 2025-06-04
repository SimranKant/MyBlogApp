const Comment = require("../models/comments.js");
const Blog = require("../models/blogs.js");
module.exports.createComment = async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  let newComment = new Comment(req.body);
  newComment.owner = req.user._id;
  blog.comments.push(newComment);
  await newComment.save();
  await blog.save();
  req.flash("success", "Comment Created");
  res.redirect(`/blogs/${req.params.id}`);
};

module.exports.deleteComment = async (req, res) => {
  let { id, commentId } = req.params;
  await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Comment Deleted");
  res.redirect(`/blogs/${id}`);
};
