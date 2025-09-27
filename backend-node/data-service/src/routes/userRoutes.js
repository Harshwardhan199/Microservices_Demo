const express = require("express");
const router = express.Router();
const { getData } = require("../controllers/userController");

router.post("/getData", getData);

module.exports = router;
