"use strict";

const ScheduleService = require("../scheduleService");
const { Op } = require("sequelize");

// Initialize mock database
jest.mock("../../models", () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();

  const ProviderMock = dbMock.define("Provider", {
    id: 1,
    role: "provider",
  });

  const ScheduleMock = dbMock.define("Schedule", {
    id: 1,
    provider_id: 1,
    start_time: new Date("2022-01-01T09:00:00Z"),
    end_time: new Date("2022-01-01T10:00:00Z"),
  });

  return {
    Provider: ProviderMock,
    Schedule: ScheduleMock,
  };
});

describe("ScheduleService", () => {
  let scheduleService;
  let ProviderMock, ScheduleMock;

  beforeEach(() => {
    scheduleService = new ScheduleService();
    ({
      Provider: ProviderMock,
      Schedule: ScheduleMock,
    } = require("../../models"));
  });

  describe("createSchedule", () => {
    it("should create a new schedule", async () => {
      const providerId = 1;
      const startTime = new Date("2022-01-01T09:00:00Z");
      const endTime = new Date("2022-01-01T10:00:00Z");

      const provider = ProviderMock.build({
        id: providerId,
        role: "provider",
      });

      const existingSchedules = [];

      jest.spyOn(ProviderMock, "findByPk").mockResolvedValue(provider);
      jest.spyOn(ScheduleMock, "findAll").mockResolvedValue(existingSchedules);
      jest.spyOn(ScheduleMock, "create").mockResolvedValue({});

      const schedule = await scheduleService.createSchedule(
        providerId,
        startTime,
        endTime
      );

      expect(ProviderMock.findByPk).toHaveBeenCalledWith(providerId);
      expect(ScheduleMock.findAll).toHaveBeenCalledWith({
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
      expect(ScheduleMock.create).toHaveBeenCalledWith({
        provider_id: providerId,
        start_time: startTime,
        end_time: endTime,
      });
      expect(schedule).toBeDefined();
    });

    it("should throw an error if provider is not found", async () => {
      const providerId = 1;
      const startTime = new Date("2022-01-01T09:00:00Z");
      const endTime = new Date("2022-01-01T10:00:00Z");

      jest.spyOn(ProviderMock, "findByPk").mockResolvedValue(null);

      await expect(
        scheduleService.createSchedule(providerId, startTime, endTime)
      ).rejects.toThrow("Provider not found");

      expect(ProviderMock.findByPk).toHaveBeenCalledWith(providerId);
    });

    it("should throw an error if conflicting schedule exists", async () => {
      const providerId = 1;
      const startTime = new Date("2022-01-01T09:00:00Z");
      const endTime = new Date("2022-01-01T10:00:00Z");

      const provider = ProviderMock.build({
        id: providerId,
        role: "provider",
      });

      const existingSchedules = [
        ScheduleMock.build({
          id: 1,
          provider_id: providerId,
          start_time: new Date("2022-01-01T08:00:00Z"),
          end_time: new Date("2022-01-01T09:30:00Z"),
        }),
      ];

      jest.spyOn(ProviderMock, "findByPk").mockResolvedValue(provider);
      jest.spyOn(ScheduleMock, "findAll").mockResolvedValue(existingSchedules);

      await expect(
        scheduleService.createSchedule(providerId, startTime, endTime)
      ).rejects.toThrow("Conflicting schedule exists");

      expect(ProviderMock.findByPk).toHaveBeenCalledWith(providerId);
      expect(ScheduleMock.findAll).toHaveBeenCalledWith({
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
    });

    it("should throw an error if there is an error creating the schedule", async () => {
      const providerId = 1;
      const startTime = new Date("2022-01-01T09:00:00Z");
      const endTime = new Date("2022-01-01T10:00:00Z");

      const provider = ProviderMock.build({
        id: providerId,
        role: "provider",
      });

      jest.spyOn(ProviderMock, "findByPk").mockResolvedValue(provider);
      jest.spyOn(ScheduleMock, "findAll").mockResolvedValue([]);
      jest
        .spyOn(ScheduleMock, "create")
        .mockRejectedValue(new Error("Database error"));

      await expect(
        scheduleService.createSchedule(providerId, startTime, endTime)
      ).rejects.toThrow("Database error");

      expect(ProviderMock.findByPk).toHaveBeenCalledWith(providerId);
      expect(ScheduleMock.findAll).toHaveBeenCalledWith({
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
      expect(ScheduleMock.create).toHaveBeenCalledWith({
        provider_id: providerId,
        start_time: startTime,
        end_time: endTime,
      });
    });
  });
});
