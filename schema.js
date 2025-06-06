const Joi = require("joi");

module.exports.blogSchema = Joi.object({
    blog:Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        likes: Joi.number().min(0),
        image: Joi.string().allow("",null),
    }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.string()
    .trim()
    .min(1)
    .required()
});
