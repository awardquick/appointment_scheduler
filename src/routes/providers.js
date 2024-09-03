const express = require("express");
const router = express.Router();
const providersController = require("../controllers/providers");

router.post("/:providerId/schedules", providersController.createSchedule);

module.exports = router;
