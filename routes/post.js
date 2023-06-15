const express = require("express");
const router = express.Router();
const {
  getPosts,
  postPosts,
  likePost,
  deletePost,
  getPost,
} = require("../controllers/post");
const { protect } = require("../middleware/auth");
const commentRouter = require("./comment");

router.use("/:postId/comment", protect, commentRouter);

router.put("/:postId/like", protect, likePost);
router.route("/:postId").delete(protect, deletePost).get(getPost);
router.get("/", getPosts).post("/", protect, postPosts);
module.exports = router;
