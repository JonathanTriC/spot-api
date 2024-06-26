const express = require("express");
const router = new express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const URL = require("../helpers/url");

router.get(
	`${URL.BASE_NAME_USERS}/allUsers`,
	authMiddleware,
	UserController.getAllUsers
);
router.post(`${URL.BASE_NAME_USERS}/signup`, UserController.signUp);
router.post(`${URL.BASE_NAME_USERS}/login`, UserController.logIn);
router.post(
	`${URL.BASE_NAME_USERS}/logout`,
	authMiddleware,
	UserController.logOut
);
router.get(
	`${URL.BASE_NAME_USERS}/profile`,
	authMiddleware,
	UserController.getUserProfile
);
router.get(`${URL.BASE_NAME_USERS}/:id`, UserController.getUserById);
router.patch(
	`${URL.BASE_NAME_USERS}/update`,
	authMiddleware,
	UserController.updateUser
);
router.delete(
	`${URL.BASE_NAME_USERS}/delete`,
	authMiddleware,
	UserController.deleteUser
);

module.exports = router;
