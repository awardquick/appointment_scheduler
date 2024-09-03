"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.Schedule, {
        foreignKey: "schedule_id",
        as: "schedule",
      });
      Appointment.belongsTo(models.Client, {
        foreignKey: "client_id",
        as: "client",
      });
    }
  }
  Appointment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      schedule_id: DataTypes.UUID,
      client_id: DataTypes.UUID,
      reservation_time: DataTypes.DATE,
      confirmed: DataTypes.BOOLEAN,
      expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
