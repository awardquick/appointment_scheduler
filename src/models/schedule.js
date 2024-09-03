"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Schedule.belongsTo(models.Provider, {
        foreignKey: "provider_id",
        as: "provider",
      });
      Schedule.hasMany(models.Appointment, {
        foreignKey: "schedule_id",
        as: "appointments",
      });
    }
  }
  Schedule.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      provider_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
