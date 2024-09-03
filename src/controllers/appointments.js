// controllers/appointments.js

const AppointmentService = require("../services/appointmentService");
const appointmentService = new AppointmentService();
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const slots = await appointmentService.getAvailableSlots(date);
    return res.status(200).json(slots);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const reserveSlot = async (req, res) => {
  const { schedule_id, client_id, reservation_time } = req.body; // Expect data in the body

  if (!schedule_id || !client_id || !reservation_time) {
    return res.status(400).json({
      error: "Schedule ID, Client ID, and Reservation Time are required",
    });
  }
  try {
    const appointment = await appointmentService.reserveSlot(
      schedule_id,
      client_id,
      reservation_time
    );
    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const confirmAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  if (!appointmentId) {
    return res.status(400).json({ error: "Appointment ID is required" });
  }

  try {
    const confirmedAppointment = await appointmentService.confirmAppointment(
      appointmentId
    );
    return res.status(200).json(confirmedAppointment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  reserveSlot,
  confirmAppointment,
};
