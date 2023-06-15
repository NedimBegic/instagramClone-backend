const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Comment = require("../models/Comment");

// desc     Add a comment on a post
//@route    POST /:id/comment
// @acces   Public
exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.postId;
  req.body.author = req.user.nickName;
  if (!req.body.comment) {
    return next(new ErrorResponse("Enter a valid comment", 400));
  }
  const comment = await Comment.create(req.body);
  res.status(200).json({
    success: true,
    data: comment,
  });
});

// desc     Get all comments from a post
//@route    GET /:id/comment
// @acces   Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find().populate([
    {
      path: "user",
      select: "photo ",
    },
    {
      path: "post",
      select: "photo",
    },
  ]);
  res.status(200).json({
    success: true,
    data: comments,
  });
});
