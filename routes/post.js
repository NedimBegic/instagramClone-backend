const express = require("express");
const { getPosts, postPosts } = require("../controllers/post");
const { protect } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

router.get("/", getPosts).post("/", protect, postPosts);
module.exports = router;
