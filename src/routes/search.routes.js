const express = require("express");
const router = express.Router();
const controller = require("../controllers/search.controller");

router.get("/", controller.searchProfiles);

module.exports = router;