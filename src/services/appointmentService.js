const { Op } = require("sequelize");
const { Schedule, Appointment, Provider } = require("../models");

class AppointmentService {
  async getAvailableSlots(dateString) {
    try {
      // The dateString is assumed to be in UTC and ISO 8601 format
      const date = new Date(dateString);

      // Define start and end of the day in UTC
      const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

      // Find all schedules within this UTC day
      const schedules = await Schedule.findAll({
        where: {
          [Op.and]: [
            { start_time: { [Op.lte]: endOfDay } },
            { end_time: { [Op.gte]: startOfDay } },
          ],
        },
        include: [
          {
            model: Appointment,
            as: "appointments",
            required: false, // Left join to include schedules with no appointments
          },
          {
            model: Provider,
            as: "provider",
          },
        ],
      });

      const availableSlots = [];

      // Loop through each schedule and calculate available slots
      schedules.forEach((schedule) => {
        const { start_time, end_time, appointments, provider } = schedule;

        let currentTime = new Date(start_time);
        while (currentTime < end_time) {
          // Check if there's an appointment at the current time slot
          const isBooked = appointments.some(
            (appt) =>
              new Date(appt.reservation_time).getTime() ===
              currentTime.getTime()
          );

          // If not booked, add to available slots for the specific provider
          if (!isBooked) {
            availableSlots.push({
              schedule_id: schedule.id,
              provider_id: schedule.provider_id,
              provider_name: `${provider.first_name} ${provider.last_name}`, // Assuming provider has these fields
              time: new Date(currentTime).toISOString(), // Convert to ISO string
            });
          }

          // Increment by 15 minutes
          currentTime.setMinutes(currentTime.getMinutes() + 15);
        }
      });

      return availableSlots;
    } catch (error) {
      console.error("Error fetching available slots:", error);
      throw error;
    }
  }

  async reserveSlot(scheduleId, clientId, reservationTime) {
    try {
      // Check if the slot is available
      const schedule = await Schedule.findOne({
        where: { id: scheduleId },
        include: [
          {
            model: Appointment,
            as: "appointments",
            required: false,
          },
        ],
      });

      if (!schedule) {
        throw new Error("Schedule not found");
      }

      // Check if the reservation time falls within the schedule
      const reservationDate = new Date(reservationTime);
      if (
        reservationDate < schedule.start_time ||
        reservationDate > schedule.end_time
      ) {
        throw new Error("Reservation time is outside of the schedule");
      }

      // Check if the reservation is made at least 24 hours in advance
      const currentTime = new Date();
      const minReservationTime = new Date(
        currentTime.getTime() + 24 * 60 * 60 * 1000
      ); // 24 hours from now

      if (reservationDate < minReservationTime) {
        throw new Error(
          "Appointments must be scheduled at least 24 hours in advance"
        );
      }

      // Check if the slot is already booked
      const existingAppointment = await Appointment.findOne({
        where: {
          schedule_id: scheduleId,
          reservation_time: reservationDate,
        },
      });

      if (existingAppointment) {
        throw new Error("Slot is already booked");
      }

      // Create the appointment (reservation)
      const appointment = await Appointment.create({
        schedule_id: scheduleId,
        client_id: clientId,
        reservation_time: reservationDate,
      });

      return appointment;
    } catch (error) {
      console.error("Error reserving slot:", error);
      throw error;
    }
  }

  async confirmAppointment(appointmentId) {
    try {
      const appointment = await Appointment.findByPk(appointmentId);

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      if (appointment.confirmed) {
        throw new Error("Appointment already confirmed");
      }

      appointment.confirmed = true;
      await appointment.save();

      return appointment;
    } catch (error) {
      console.error("Error confirming appointment:", error);
      throw error;
    }
  }
}

module.exports = AppointmentService;
