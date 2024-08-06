const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const featureSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Feature name is required"],
			unique: true,
		},
		icon: {
			type: String,
			required: [true, "Feature icon is required"],
		},
	},
	{ timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);

module.exports = Feature;
