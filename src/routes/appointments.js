const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointments");

router.get("/:date/slots", appointmentsController.getAvailableSlots);
router.post("/reserve-slot", appointmentsController.reserveSlot);
router.put(
  "/:appointmentId/confirm",
  appointmentsController.confirmAppointment
);

module.exports = router;
