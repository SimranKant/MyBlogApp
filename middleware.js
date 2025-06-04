const Blog = require("./models/blogs");
const Comment = require("./models/comments");
const ExpressError = require("./utils/ExpressError.js");
const { blogSchema, commentSchema } =require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    res.redirect("/login");
  } else {
    next();
  }
};


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let blog = await Blog.findById(id);
    if (!blog.author._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not author of this blog");
      res.redirect(`/blogs/${id}`);
    }else{
        next();
    }
    
};

module.exports.validateBlog = (req, res, next) => {
  let { error } = blogSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isCommentOwner = async(req,res,next)=>{
    let { id,commentId } = req.params;
    let comment = await Comment.findById(commentId);
    if (!comment.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "This is not your comment");
      res.redirect(`/blogs/${id}`);
    }else{
        next();
    }
    
};