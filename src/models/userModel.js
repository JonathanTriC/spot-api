const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		full_name: {
			type: String,
			required: [true, "Please add your full name"],
			minLength: [3, "Full name must be at least 3 characters"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please add your email address"],
			unique: [true, "It looks like you already have an account!"],
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Please enter a valid email address!");
				}
			},
		},
		phone_number: {
			type: String,
			trim: true,
			validate(value) {
				if (!validator.isMobilePhone(value)) {
					throw new Error("Please enter a valid phone number!");
				}
			},
		},
		avatar: {
			type: String,
		},
		role: {
			type: String,
			default: "User",
		},
		password: {
			type: String,
			required: [true, "Please add your password"],
			minlength: [6, "Password must be at least 6 characters"],
			trim: true,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign(
		{
			id: user._id.toString(),
			email: user.email,
			full_name: user.full_name,
			role: user.role,
		},
		process.env.SECRET_KEY
	);

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Unable to login!");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Unable to login!");
	}

	return user;
};

// MARK: Hashing password before save
userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	userObject.id = userObject._id;

	delete userObject._id;
	delete userObject.__v;
	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);

module.exports = User;
