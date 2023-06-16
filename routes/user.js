const express = require("express");
const router = express.Router();
const { getUser, getUsers, userPhotoUpload } = require("../controllers/user");
const { protect } = require("../middleware/auth");

router.get("/:nickName", protect, getUser);
router.get("/", getUsers);
router.route("/:userId/photo").put(protect, userPhotoUpload);

module.exports = router;
