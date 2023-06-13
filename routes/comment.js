const express = require("express");
const { addComment, getComments } = require("../controllers/comment");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");

router.post("/", protect, addComment).get("/", getComments);

module.exports = router;
