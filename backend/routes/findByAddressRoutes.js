const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant"); // Import the Restaurant model

// Haversine formula to calculate distance between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Degrees to radians
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// GET /api/restaurants/restaurant/findbyaddress - Fetch paginated restaurants based on location (latitude, longitude)
router.get("/findByAddress", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 9; // Number of results per page
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);
        const maxDistance = 3; // Max distance in km (3 km radius)

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: "Invalid latitude or longitude" });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: "Latitude or Longitude out of bounds" });
        }

        const skip = (page - 1) * limit;

        // Fetch restaurants and filter based on the Haversine distance formula
        const rawData = await Restaurant.aggregate([
            { $unwind: "$restaurants" },
            {
                $project: {
                    _id: 0,
                    name: "$restaurants.restaurant.name",
                    id: "$restaurants.restaurant.R.res_id",
                    cuisines: "$restaurants.restaurant.cuisines",
                    user_rating: "$restaurants.restaurant.user_rating",
                    average_cost_for_two: "$restaurants.restaurant.average_cost_for_two",
                    location: "$restaurants.restaurant.location.address",
                    featured_image: "$restaurants.restaurant.featured_image",
                    latitude: { $toDouble: "$restaurants.restaurant.location.latitude" },  // Add latitude
                    longitude: { $toDouble: "$restaurants.restaurant.location.longitude" } // Add longitude
                },
            },
            { $skip: skip },
            { $limit: limit }
        ]);

         // Log to see the results of the aggregation

        // Manually filter restaurants within the given radius
        const filteredRestaurants = rawData.filter((restaurant) => {
            const lat = restaurant.latitude;
            const lon = restaurant.longitude;

            // Ensure valid numeric values
            if (isNaN(lat) || isNaN(lon)) return false;

            const distance = calculateDistance(latitude, longitude, lat, lon);
            return distance <= maxDistance;
        });

        const total = filteredRestaurants.length;
        const totalPages = Math.ceil(total / limit);

        const paginatedData = filteredRestaurants.slice(skip, skip + limit);

        if (paginatedData.length === 0) {
            return res.status(404).json({ error: "No restaurants found in this area" });
        }

        res.json({
            restaurants: paginatedData,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching restaurant data" });
    }
});

module.exports = router;
