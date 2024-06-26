require("./db/mongoose");
require("dotenv").config();
const express = require("express");
const userRouter = require("./routers/userRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
	console.log("Server is up on port " + port);
});
