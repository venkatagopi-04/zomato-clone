require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const restaurantRoutes = require("./routes/restaurantRoutes"); // Existing route
const restaurantDetailsIDRoutes = require("./routes/restaurantDetailsIDRoutes"); // New route
const completeDetailsRoutes = require("./routes/completeDetailsRoutes");
const findByAddressRoutes = require("./routes/findByAddressRoutes");
const foodRoutes = require("./routes/foodRoutes");
const findByCusineRoutes = require("./routes/findByCusineRoutes");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

// Use routes
app.use("/api/restaurants", restaurantRoutes); // Existing route for listing restaurants
app.use("/api/restaurants", restaurantDetailsIDRoutes); // New route for fetching a restaurant by ID
app.use("/api/restaurants", completeDetailsRoutes);

app.use("/api/restaurants", findByAddressRoutes); // old route
app.use("/api", foodRoutes); // Base route for API
app.use("/api", findByCusineRoutes); // Base route for API

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
