const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware")
const microMiddleware = require("../middlewares/microMiddleware");

const { getData, changeSecret } = require("../controllers/userController");

router.post("/getData", authMiddleware, microMiddleware, getData);

router.post("/changeSecret", authMiddleware, microMiddleware, changeSecret);

module.exports = router;