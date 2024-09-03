const { Schedule, Provider } = require("../models");
const { Op } = require("sequelize");

class ScheduleService {
  static async createSchedule(providerId, startTime, endTime) {
    try {
      const provider = await Provider.findByPk(providerId);
      if (!provider) {
        throw new Error("Provider not found");
      }

      const existingSchedules = await Schedule.findAll({
        where: {
          provider_id: providerId,
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [startTime, endTime],
              },
            },
            {
              end_time: {
                [Op.between]: [startTime, endTime],
              },
            },
            {
              [Op.and]: [
                { start_time: { [Op.lte]: startTime } },
                { end_time: { [Op.gte]: endTime } },
              ],
            },
          ],
        },
      });

      if (existingSchedules.length > 0) {
        throw new Error("Conflicting schedule exists");
      }

      const schedule = await Schedule.create({
        provider_id: providerId,
        start_time: startTime,
        end_time: endTime,
      });

      return schedule;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }
}

module.exports = ScheduleService;
