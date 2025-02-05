const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant"); // Import the Restaurant model

// GET /api/restaurants/restaurant/:id - Fetch a single restaurant by its ID
router.get("/restaurant/:id", async (req, res) => {
    try {
        let { id } = req.params; // Extract restaurant ID from URL parameter

        console.log("Searching for restaurant ID:", id); // Log the requested ID

        // Find the specific restaurant by its unique ID (search in the entire database)
        const restaurant = await Restaurant.aggregate([
            { $unwind: "$restaurants" }, // Unwind the restaurants array to flatten it
            { $match: { "restaurants.restaurant.id": id } }, // Match the restaurant by the 'id'
            {
                $project: {
                    _id: 0, // Exclude MongoDB _id field
                    name: "$restaurants.restaurant.name",
                    id: "$restaurants.restaurant.R.res_id",
                    cuisines: "$restaurants.restaurant.cuisines",
                    user_rating: "$restaurants.restaurant.user_rating",
                    average_cost_for_two: "$restaurants.restaurant.average_cost_for_two",
                    location: "$restaurants.restaurant.location.address",
                    featured_image: "$restaurants.restaurant.featured_image",
                },
            },
        ]);

        // Log the result before responding
        console.log("Restaurant found:", restaurant); // Log the data of the found restaurant

        if (restaurant.length === 0) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.json(restaurant[0]); // Return the found restaurant
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching restaurant data" });
    }
});

module.exports = router;
