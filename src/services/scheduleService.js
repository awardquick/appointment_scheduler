const { Schedule, Provider } = require("../models");
const { Op } = require("sequelize");

class ScheduleService {
  async createSchedule(providerId, startTime, endTime) {
    try {
      const roundToNearestInterval = (date, intervalMinutes) => {
        const ms = date.getTime();
        const intervalMs = intervalMinutes * 60 * 1000;
        return new Date(Math.round(ms / intervalMs) * intervalMs);
      };

      const normalizedStartTime = roundToNearestInterval(
        new Date(startTime),
        15
      );
      const normalizedEndTime = roundToNearestInterval(new Date(endTime), 15);

      if (normalizedEndTime <= normalizedStartTime) {
        throw new Error("End time must be after start time");
      }

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
                [Op.between]: [normalizedStartTime, normalizedEndTime],
              },
            },
            {
              end_time: {
                [Op.between]: [normalizedStartTime, normalizedEndTime],
              },
            },
            {
              [Op.and]: [
                { start_time: { [Op.lte]: normalizedStartTime } },
                { end_time: { [Op.gte]: normalizedEndTime } },
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
        start_time: normalizedStartTime,
        end_time: normalizedEndTime,
      });

      return schedule;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }
}

module.exports = ScheduleService;
