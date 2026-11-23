const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

// Existing authentication routes
app.use("/api/auth", require("./routes/authRoutes"));

// Blog CRUD routes
app.use("/api/blogs", require("./routes/blogRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});