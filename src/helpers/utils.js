const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const sendResponse = ({ res, status, message, data }) => {
	const messages = {
		200: "Success",
		201: "Success",
		500: "Server Error!",
	};

	message = messages[status] || message;
	if (message !== "Success") {
		data = {};
	}

	return res.status(status).json({ status, message, data });
};

const getPagination = (limit, offset) => {
	const page = offset ? +offset : 10;
	const size = limit ? limit * limit : 0;

	return { page, size };
};

const generateGuestToken = () => {
	return jwt.sign(
		{
			id: new mongoose.Types.ObjectId(), // Placeholder id
			email: "guest@example.com", // Placeholder email
			full_name: "Guest User", // Placeholder name
			role: "Guest", // Role set to 'Guest'
		},
		process.env.SECRET_KEY
	);
};

module.exports = { sendResponse, getPagination, generateGuestToken };
