require("./db/mongoose");
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const Utils = require("./helpers/utils");
const userRouter = require("./routers/userRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);

app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return Utils.sendResponse({
				res,
				status: 400,
				message: "File size too large. Please upload a file smaller than 5MB.",
			});
		}
		return Utils.sendResponse({
			res,
			status: 400,
			message: "Failed to upload file.",
		});
	}

	if (err == "File not support") {
		return Utils.sendResponse({
			res,
			status: 400,
			message: "File is not supported! Use .jpg/.jpeg/.png",
		});
	}

	// Handle other errors
	Utils.sendResponse({
		res,
		status: 500,
		message: err.message || "Server error",
	});
});

app.listen(port, () => {
	console.log("Server is up on port " + port);
});
