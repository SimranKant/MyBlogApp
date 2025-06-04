const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comments");
const { required } = require("joi");

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    url:String,
    filename: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

blogSchema.post("findOneAndDelete", async (blog) => {
  if (blog) {
    await Comment.deleteMany({ _id: { $in: blog.comments } });
  }
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
