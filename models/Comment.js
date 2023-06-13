const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    author: String,
    comment: {
      type: String,
      required: [true, "Please enter a valid comment"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.virtual("user", {
  ref: "user",
  localField: "author",
  foreignField: "nickName",
  justOne: false,
});

module.exports = mongoose.model("comment", CommentSchema);
