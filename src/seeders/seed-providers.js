"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Define specialties
      const providers = [];
      const specialties = ["testosterone", "weightloss"];

      for (let i = 0; i < 100; i++) {
        providers.push({
          id: uuidv4(),
          specialty:
            specialties[Math.floor(Math.random() * specialties.length)],
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Insert seed data into the 'Providers' table
      await queryInterface.bulkInsert("Providers", providers);
      console.log("Providers seeded successfully!");
    } catch (error) {
      console.error("Error seeding providers:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all providers from the 'Providers' table
    await queryInterface.bulkDelete("Providers", null, {});
  },
};
