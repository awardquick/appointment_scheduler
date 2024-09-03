require("dotenv").config(); // Load environment variables from .env file
require("./scripts/appointmentCleanup");
const express = require("express");
const { Sequelize } = require("sequelize");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
const appointmentRouter = require("./routes/appointments");
const providerRouter = require("./routes/providers");

app.use("/providers", providerRouter);
app.use("/appointments", appointmentRouter);
// Set up Sequelize using environment variables
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
