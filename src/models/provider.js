"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Provider.hasMany(models.Schedule, {
        foreignKey: "provider_id",
        as: "schedules",
      });
    }
  }
  Provider.init(
    {
      email: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      specialty: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Provider",
    }
  );
  return Provider;
};
