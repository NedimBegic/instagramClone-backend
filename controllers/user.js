const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// desc     Get a user
//@route    GET /:nickName
// @acces   Public
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

// desc     Get all users
//@route    GET /user
// @acces   Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
  });
});

// desc     Change user info
//@route    PUT /:nickName
// @acces   Private
exports.changeUserInfo = asyncHandler(async (req, res, next) => {
  const { description, name } = req.body;
  const userUpdate = await User.findOneAndUpdate(
    { nickName: req.params.nickName },
    { description, name }
  );
  res.status(200).json({
    success: true,
    data: userUpdate,
  });
});

// desc     Upload user photo
//@route    PUT /user/:userId/photo
// @acces   Public
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new ErrorResponse("There is no such user", 404));
  }

  if (user._id.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        "This user is not authorized to upload photo on this profile",
        400
      )
    );
  }
  if (!req.files) {
    // if there is no file
    return next(new ErrorResponse("Please upload a file", 400));
  }
  const file = req.files.file;
  // Make sure that image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload a image file", 400));
  }

  // CHeck size of file
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse("File size is to big", 400));
  }

  file.name = `${file.name.split(".")[0]}${req.params.userId}${
    path.parse(file.name).ext
  }`;

  // method for saving photo
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem with upload", 500));
    }

    await User.findByIdAndUpdate(req.params.userId, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
