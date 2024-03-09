const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

module.exports = router;