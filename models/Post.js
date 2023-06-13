const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: Number,
  whoLiked: [String],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("post", PostSchema);
