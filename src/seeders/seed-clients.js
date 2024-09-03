"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const clients = [];
      for (let i = 0; i < 100; i++) {
        clients.push({
          id: uuidv4(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Insert seed data into the 'Clients' table
      await queryInterface.bulkInsert("Clients", clients);
      console.log("Clients seeded successfully!");
    } catch (error) {
      console.error("Error seeding clients:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all clients from the 'Clients' table
    await queryInterface.bulkDelete("Clients", null, {});
  },
};
