const express = require("express");
const {
  addComment,
  getComments,
  getComment,
} = require("../controllers/comment");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");

router.post("/", protect, addComment).get("/", getComments);
router.get("/:postId", getComment);

module.exports = router;
