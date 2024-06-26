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

module.exports = { sendResponse, getPagination };
