const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");

// desc     Get all posts
//@route    GET /post
// @acces   Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("user");
  res.status(200).json({
    success: true,
    data: posts,
  });
});

// desc     insert single post
//@route    Post /post
// @acces   Private
exports.postPosts = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  console.log(req.body);
  const post = await Post.create(req.body);
  res.status(200).json({
    success: true,
    data: post,
  });
});
