const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGO_URL;

mongoose
	.connect(mongoURL, {})
	.then(() => console.log("Database Connected"))
	.catch((err) => console.log(err));
