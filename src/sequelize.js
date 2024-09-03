const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("DB Name:", process.env.DB_NAME);
console.log("DB Username:", process.env.DB_USERNAME);
console.log("DB Host:", process.env.DB_HOST);
console.log("DB Password:", process.env.DB_PASSWORD);
console.log("DB Dialect:", process.env.DB_DIALECT);

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = sequelize;
