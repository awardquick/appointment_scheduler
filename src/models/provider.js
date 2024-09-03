"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Initialize the array for provider data
    const providers = [];
    console.log(faker.internet.email());
    console.log(faker.person.firstName());
    console.log(faker.person.lastName());
    console.log(faker.name.jobTitle());
    // Generate 100 provider records
    for (let i = 0; i < 100; i++) {
      providers.push({
        id: uuidv4(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        specialty: faker.person.jobTitle(), // Using job title for specialty
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert seed data into the 'Providers' table
    await queryInterface.bulkInsert("Providers", providers);
  },

  async down(queryInterface, Sequelize) {
    // Remove all providers from the 'Providers' table
    await queryInterface.bulkDelete("Providers", null, {});
  },
};
