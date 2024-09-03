const ScheduleService = require("../services/scheduleService");

const createSchedule = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { start_time, end_time } = req.body;
    const scheduleService = new ScheduleService();
    const schedule = await scheduleService.createSchedule(
      providerId,
      start_time,
      end_time
    );

    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createSchedule,
};
