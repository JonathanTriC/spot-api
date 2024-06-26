const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Utils = require("../helpers/utils");
require("dotenv").config();

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		const user = await User.findById({
			_id: decodedToken.id,
			"tokens.token": token,
		});

		if (!user) {
			throw new Error();
		}

		req.token = token;
		req.user = user;
		next();
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 401,
			message: "Invalid authentication credentials.",
		});
	}
};

module.exports = auth;
