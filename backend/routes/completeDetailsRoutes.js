const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant"); // Import the Restaurant model

// GET /api/restaurants/completeDetails/:id - Fetch complete details of a restaurant
router.get("/completeDetails/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract restaurant ID from URL parameter

        console.log("Searching for complete restaurant details for ID:", id); // Log the requested ID

        // Find the specific restaurant by its 'id' and return all details
        const restaurant = await Restaurant.aggregate([
            { $unwind: "$restaurants" }, // Unwind the restaurants array to flatten it
            { $match: { "restaurants.restaurant.id": id } }, // Match the restaurant by the 'id'
            {
                $project: {
                    _id: 0, // Exclude MongoDB _id field
                    name: "$restaurants.restaurant.name",
                    cuisines: "$restaurants.restaurant.cuisines",
                    user_rating: "$restaurants.restaurant.user_rating",
                    average_cost_for_two: "$restaurants.restaurant.average_cost_for_two",
                    location: "$restaurants.restaurant.location",
                    featured_image: "$restaurants.restaurant.featured_image",
                    photos_url: "$restaurants.restaurant.photos_url",
                    url: "$restaurants.restaurant.url",
                    price_range: "$restaurants.restaurant.price_range",
                    apikey: "$restaurants.restaurant.apikey",
                    deeplink: "$restaurants.restaurant.deeplink",
                    menu_url: "$restaurants.restaurant.menu_url",
                    book_url: "$restaurants.restaurant.book_url",
                    switch_to_order_menu: "$restaurants.restaurant.switch_to_order_menu",
                    offers: "$restaurants.restaurant.offers",
                    is_delivering_now: "$restaurants.restaurant.is_delivering_now",
                    has_online_delivery: "$restaurants.restaurant.has_online_delivery",
                    zomato_events: "$restaurants.restaurant.zomato_events",
                    currency: "$restaurants.restaurant.currency",
                    id: "$restaurants.restaurant.id",
                    thumb: "$restaurants.restaurant.thumb",
                    events_url: "$restaurants.restaurant.events_url",
                    establishment_types: "$restaurants.restaurant.establishment_types",
                    results_found: "$results_found",
                    results_shown: "$results_shown",
                    results_start: "$results_start",
                },
            },
        ]);

        // Log the result before responding
        console.log("Complete restaurant details found:", restaurant); // Log the data of the found restaurant

        if (restaurant.length === 0) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.json(restaurant[0]); // Return the complete restaurant details
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching complete restaurant data" });
    }
});

module.exports = router;
