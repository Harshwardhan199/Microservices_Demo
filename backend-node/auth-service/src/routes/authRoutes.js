const express = require("express");
const router = express.Router();
const { register, login,google, refresh } = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.post("/google", google);

router.post("/refresh", refresh);

module.exports = router;
