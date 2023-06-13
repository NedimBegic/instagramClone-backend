// class for error
const ErrorResponse = require("../utils/errorResponse");
// our middlaware to handle async
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// desc     ++++++++++++++++ Register user
//@route    POST /api/v1/auth/register
// @acces   Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, nickName } = req.body;

  // Create use
  const user = await User.create({
    nickName,
    name,
    email,
    password,
  });

  sendtokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email $ password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and a password", 400)
    );
  }

  // Check for user with email
  // include password with select
  // Model is always starting with upperCase
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  // Check if password matched in model usinc bcrypt.compare
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }

  sendtokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendtokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    // calculate 30 days of expires
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 + 1000
    ),
    // only acces to client side script
    httpOnly: true,
  };

  if (process.env.NODE_END === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ succes: true, token });
};
