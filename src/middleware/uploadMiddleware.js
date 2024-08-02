const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = /jpeg|jpg|png/;
	const extname = allowedFileTypes.test(
		require("path").extname(file.originalname).toLowerCase()
	);

	const mimetype = allowedFileTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("File not support");
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

module.exports = upload;
