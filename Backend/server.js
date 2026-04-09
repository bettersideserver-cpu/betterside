const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();
const cors = require("cors");

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://betterside.onrender.com",
  "https://betterside-api.onrender.com",
  "https://www.betterside.in",
  "https://betterside.in"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ ADD THIS LINE (VERY IMPORTANT)
app.options("*", cors());

app.use(express.json());

// ROUTES — fixed: all routes before app.listen()
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
