const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
// to get req.cookie running
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/.env" });
const errorHandler = require("./middleware/error");

connectDB();

// +++++++++ROUTES
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const comment = require("./routes/comment");

// Body parser for access req.body
app.use(express.json());

// for file upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Cookie parser
app.use(cookieParser());
// Mount routes from bootcamp,courses file
app.use("/auth", auth);
app.use("/user", user);
app.use("/post", post);
app.use("/comment", comment);

// using middleware it has to be after calling routes and mounting them
app.use(errorHandler);
PORT = process.env.PORT;
app.listen(PORT || 5000, console.log(`Server is running on port ${PORT}`));
