const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointments");

router.get("/:providerId/slots", appointmentsController.getSlots);
router.post("/:slotId/reserve", appointmentsController.reserveSlot);
router.put(
  "/:appointmentId/confirm",
  appointmentsController.confirmAppointment
);

module.exports = router;
