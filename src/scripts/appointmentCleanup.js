const Bull = require("bull");
const { Appointment, Sequelize } = require("../models");

const appointmentQueue = new Bull("appointment cleanup", {
  redis: {
    port: 6379,
    host: "localhost",
  },
});

appointmentQueue.process(async (job) => {
  try {
    const now = new Date();
    const result = await Appointment.destroy({
      where: {
        expires_at: {
          [Sequelize.Op.lt]: now,
        },
        confirmed: false,
      },
      limit: 1000,
    });
  } catch (error) {
    console.error("Error cleaning up appointments:", error);
  }
});

appointmentQueue.add({}, { repeat: { every: 5 * 60 * 1000 } });
