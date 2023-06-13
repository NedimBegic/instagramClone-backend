const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.get("/:nickName", protect, getUser);

module.exports = router;
