const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/user");
const { protect } = require("../middleware/auth");
const postRouter = require("./post");

router.use("/:nickName/post", postRouter);

router.get("/:nickName", protect, getUser);

module.exports = router;
