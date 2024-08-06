const express = require("express");
const router = new express.Router();
const FeatureController = require("../controllers/featureController");
const authMiddleware = require("../middleware/authMiddleware");
const URL = require("../helpers/url");

router.get(
	`${URL.BASE_NAME_FEATURES}/all`,
	authMiddleware,
	FeatureController.getAllFeatures
);
router.post(
	`${URL.BASE_NAME_FEATURES}/add`,
	authMiddleware,
	FeatureController.addFeatures
);
router.patch(
	`${URL.BASE_NAME_FEATURES}/update/:id`,
	authMiddleware,
	FeatureController.updateFeature
);
router.delete(
	`${URL.BASE_NAME_FEATURES}/delete/:id`,
	authMiddleware,
	FeatureController.deleteFeature
);

module.exports = router;
