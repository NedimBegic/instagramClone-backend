const express = require("express");
const router = express.Router();
const { getUser, getUsers } = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.get("/:nickName", protect, getUser);
router.get("/", getUsers);

module.exports = router;
