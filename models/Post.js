const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
PostSchema.virtual("comment", {
  ref: "comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

module.exports = mongoose.model("post", PostSchema);
