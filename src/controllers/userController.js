const User = require("../models/userModel");
const Utils = require("../helpers/utils");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// MARK: Guest Login
exports.guestLogIn = async (req, res) => {
	try {
		const guestUser = {
			id: new mongoose.Types.ObjectId(),
			email: "guest@example.com",
			full_name: "Guest User",
			role: "Guest",
		};
		const guestToken = Utils.generateGuestToken(guestUser);

		Utils.sendResponse({
			res,
			status: 200,
			data: { user: guestUser, token: guestToken },
		});
	} catch (err) {
		console.log(err);
		Utils.sendResponse({
			res,
			status: 500,
			message: "Internal server error while generating guest token.",
		});
	}
};

// MARK: User Sign Up
exports.signUp = async (req, res) => {
	const newUser = new User(req.body);

	try {
		const savedUser = await newUser.save();
		const token = await newUser.generateAuthToken();

		Utils.sendResponse({
			res,
			status: 201,
			data: { user: savedUser, token },
		});
	} catch (err) {
		// Error handling for duplicate email address
		if (err.code === 11000) {
			return Utils.sendResponse({
				res,
				status: 400,
				message: "It looks like you already have an account.\nPlease sign in.",
			});
		}

		// Error handling for misc validation errors
		if (err.name === "ValidationError") {
			const message = Object.values(err.errors).map((value) => value.message);
			return Utils.sendResponse({
				res,
				status: 400,
				message,
			});
		}
	}
};

// MARK: User Log In
exports.logIn = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();

		Utils.sendResponse({
			res,
			status: 200,
			data: { user, token },
		});
	} catch (err) {
		console.log(err);
		Utils.sendResponse({
			res,
			status: 400,
			message: "Unable to login!\nMake sure your email and password are valid.",
		});
	}
};

// MARK: User Log Out
exports.logOut = async (req, res) => {
	try {
		if (req.user.role === "User") {
			req.user.tokens = req.user.tokens.filter((item) => {
				return item.token !== req.token;
			});

			await req.user.save();
		}

		Utils.sendResponse({
			res,
			status: 200,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: User Profile
exports.getUserProfile = async (req, res) => {
	try {
		Utils.sendResponse({
			res,
			status: 200,
			data: req.user,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: Get All Users
exports.getAllUsers = async (req, res) => {
	const { limit, page } = req.query;
	// var condition = email
	// 	? { email: { $regex: new RegExp(email), $options: "i" } }
	// 	: {};

	// const { page, size } = Utils.getPagination(limit, offset);
	const options = {
		page,
		limit,
		customLabels: {
			docs: "users",
		},
	};

	try {
		const users = await User.paginate({}, options);
		Utils.sendResponse({
			res,
			status: 200,
			data: users,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: Get User By Id
exports.getUserById = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id);
		if (!user) {
			return Utils.sendResponse({
				res,
				status: 404,
				message: "User not found!",
			});
		}
		Utils.sendResponse({
			res,
			status: 200,
			data: user,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: Update User
exports.updateUser = async (req, res) => {
	const updates = req.body;

	try {
		Object.keys(updates).forEach(
			(update) => (req.user[update] = req.body[update])
		);

		const savedUser = await req.user.save();
		return Utils.sendResponse({
			res,
			status: 200,
			data: savedUser,
		});
	} catch (err) {
		// Error handling for duplicate email address
		if (err.code === 11000) {
			return Utils.sendResponse({
				res,
				status: 400,
				message: "It looks like you already have an account. Please sign in.",
			});
		}

		// Error handling for misc validation errors
		if (err.name === "ValidationError") {
			const message = Object.values(err.errors).map((value) => value.message);
			return Utils.sendResponse({
				res,
				status: 400,
				message,
			});
		}

		Utils.sendResponse({
			res,
			status: 404,
			message: "User not found!",
		});
	}
};

// MARK: Upload Avatar
exports.uploadAvatar = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return Utils.sendResponse({
				res,
				status: 404,
				message: "User not found!",
			});
		}

		if (!req.file) {
			return Utils.sendResponse({
				res,
				status: 400,
				message: "Please upload your photo profile",
			});
		}

		// Cloudinary upload
		const uploadResult = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "avatars" },
				(error, result) => {
					if (error) return reject(error);
					resolve(result);
				}
			);
			uploadStream.end(req.file.buffer);
		});

		// Ensure secure_url is present
		if (!uploadResult || !uploadResult.secure_url) {
			throw new Error("Failed to get secure URL from Cloudinary");
		}

		// Update user's avatar with the URL from Cloudinary
		user.avatar = uploadResult.secure_url;
		console.log("result.secure_url:", JSON.stringify(uploadResult));
		await user.save();

		Utils.sendResponse({
			res,
			status: 200,
			user,
			message: "Avatar uploaded successfully",
		});
	} catch (err) {
		console.error("ERROR:", JSON.stringify(err));
		Utils.sendResponse({
			res,
			status: 500,
			message: "Server error",
		});
	}
};

// MARK: Delete User By Id
exports.deleteUser = async (req, res) => {
	try {
		await req.user.deleteOne();
		Utils.sendResponse({
			res,
			status: 200,
			data: req.user,
		});
	} catch (err) {
		console.log(err);
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};
