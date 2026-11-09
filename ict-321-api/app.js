const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);

app.use(express.json());

// Route d'accueil
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

// Route des utilisateurs
app.use("/api/users", usersRouter);

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

module.exports = app;
