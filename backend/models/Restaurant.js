const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({}, { strict: false });

const Restaurant = mongoose.model(
    "Restaurant",
    restaurantSchema,
    process.env.COLLECTION_NAME
);

module.exports = Restaurant;
