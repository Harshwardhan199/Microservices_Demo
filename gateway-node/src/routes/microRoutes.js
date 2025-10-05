const express = require("express");
const router = express.Router();

const microMiddleware = require("../middlewares/microMiddleware")
const { dataService } = require("../controllers/microController");

router.post("/dataService",microMiddleware, dataService);

module.exports = router;