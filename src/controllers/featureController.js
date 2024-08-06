const Feature = require("../models/featureModel");
const Utils = require("../helpers/utils");

// MARK: Get All Features
exports.getAllFeatures = async (req, res) => {
	const { query } = req.query;

	try {
		const searchQuery = query
			? {
					$or: [{ name: { $regex: new RegExp(query, "i") } }],
			  }
			: {};

		const features = await Feature.find(searchQuery);

		Utils.sendResponse({
			res,
			status: 200,
			data: features,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: Add Feature
exports.addFeatures = async (req, res) => {
	const newFeature = new Feature(req.body);

	try {
		const savedFeature = await newFeature.save();

		Utils.sendResponse({
			res,
			status: 201,
			data: savedFeature,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: Update Feature
exports.updateFeature = async (req, res) => {
	const featureId = req.params.id;
	const updatedFeature = req.body;

	try {
		const feature = await Feature.findByIdAndUpdate(featureId, updatedFeature, {
			new: true,
		});

		if (!feature) {
			return Utils.sendResponse({
				res,
				status: 404,
				message: "Feature not found!",
			});
		}

		Utils.sendResponse({
			res,
			status: 200,
			data: feature,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};

// MARK: Delete Feature
exports.deleteFeature = async (req, res) => {
	const featureId = req.params.id;

	try {
		const feature = await Feature.findByIdAndDelete(featureId);

		if (!feature) {
			return Utils.sendResponse({
				res,
				status: 404,
				message: "Feature not found!",
			});
		}

		Utils.sendResponse({
			res,
			status: 200,
			data: feature,
		});
	} catch (err) {
		Utils.sendResponse({
			res,
			status: 500,
		});
	}
};
