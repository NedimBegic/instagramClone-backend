const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// get users only for testing
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ nickName: req.params.nickName }).populate(
    "post"
  );
  let hisProfile;
  if (req.user.nickName === user.nickName) {
    hisProfile = true;
  } else {
    hisProfile = false;
  }
  res.status(200).json({
    success: true,
    hisProfile,
    data: user,
  });
});