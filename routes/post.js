const express = require("express");
const router = express.Router();
const { getPosts, postPosts } = require("../controllers/post");
const { protect } = require("../middleware/auth");
const commentRouter = require("./comment");

router.use("/:postId/comment", protect, commentRouter);

router.get("/", getPosts).post("/", protect, postPosts);
module.exports = router;
