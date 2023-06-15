const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// desc     Get all posts
//@route    GET /post
// @acces   Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate([
    {
      path: "user",
      select: "photo",
    },
    {
      path: "comment",
      select: "comment",
    },
  ]);
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

// desc     Get a single post
//@route    GET /:postId
// @acces   Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate([
    {
      path: "user",
      select: "nickName photo",
    },
    {
      path: "comment",
      select: "comment",
    },
  ]);

  if (!post) {
    return next(
      new ErrorResponse(`There is no post with id ${req.params.postId}`),
      400
    );
  }
  res.status(200).json({
    success: true,
    data: post,
  });
});

// desc     Like or unline
//@route    PUT /:postId/like
// @acces   Public
exports.likePost = asyncHandler(async (req, res, next) => {
  // fint the post with his _Id
  const post = await Post.findOne({ _id: req.params.postId });
  if (!post) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.postId}`),
      404
    );
  }
  // the user who is logged in
  let liker = req.user.nickName;
  // adding person who liked to the array whoLiked
  if (!post.whoLiked.includes(liker)) {
    post.whoLiked.push(liker);
  } else {
    // deleting person from array if he clicked again
    post.whoLiked = post.whoLiked.filter((e) => !e == liker);
  }
  // update the number of likes
  post.likes = post.whoLiked.length;

  post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// desc     Delete post
//@route    DELETE /:postId
// @acces   Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404)
    );
  }
  // only user who made the post can delete
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`This user can't delete this post`, 404));
  }

  // delete all comments from that post
  await Comment.deleteMany({ post: req.params.postId });

  // we delete it like this because we want to trigger the middleware for deleting all comments
  post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post is deleted and all his comments",
  });
});
