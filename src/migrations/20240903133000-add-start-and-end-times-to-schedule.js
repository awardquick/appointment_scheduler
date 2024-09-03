"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Schedules", "start_time", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("Schedules", "end_time", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Schedules", "start_time");
    await queryInterface.removeColumn("Schedules", "end_time");
  },
};
