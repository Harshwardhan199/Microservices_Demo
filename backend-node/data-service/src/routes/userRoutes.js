const express = require("express");
const router = express.Router();

const g2sValidator = require("../middlewares/g2sValidator");
const { getData, changeSecret } = require("../controllers/userController");

router.post("/getData",g2sValidator, getData);

router.post("/changeSecret",g2sValidator, changeSecret);

module.exports = router;
