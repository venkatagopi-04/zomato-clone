import "./RestaurantList.css";
import { useState, useEffect } from "react";
import axios from "axios";

import RestaurantCard from "./RestaurantCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import AddressInput from "./AddressInput";
import ImageUploader from "./FoodImage";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [restaurantById, setRestaurantById] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [cuisine, setCuisine] = useState("");
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [showLocationPopup, setShowLocationPopup] = useState(false);
    const [detectedFood, setDetectedFood] = useState(""); // Store detected food
    const [detectedCuisine, setDetectedCuisine] = useState(""); // Store detected cuisine

    useEffect(() => {
        if (cuisine) {
            fetchRestaurantsByCuisine(cuisine, pagination.currentPage);
        } else {
            fetchRestaurants(pagination.currentPage, selectedLocation);
        }
    }, [cuisine, pagination.currentPage, selectedLocation]);

    useEffect(() => {
        const filtered = restaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    }, [search, restaurants]);

    const fetchRestaurants = async (page, location) => {
        try {
            setLoading(true);
            let url = `https://restaurant-listing-backend-mvff.onrender.com/api/restaurants?page=${page}&limit=9`;

            if (location) {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    url = `https://restaurant-listing-backend-mvff.onrender.com/api/restaurants/findByAddress?latitude=${lat}&longitude=${lng}&page=${page}`;
                } else {
                    console.error("Invalid latitude or longitude:", location);
                    setError("Invalid location data.");
                    setLoading(false);
                    return;
                }
            }

            const response = await axios.get(url);
            setRestaurants(response.data.restaurants);
            setFilteredRestaurants(response.data.restaurants);
            setPagination({
                currentPage: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages,
            });
        } catch (err) {
            setError("Error fetching data");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRestaurantsByCuisine = async (cuisine, page) => {
        try {
            setLoading(true);
            const url = `https://restaurant-listing-backend-mvff.onrender.com/api/findByCuisine?cuisine=${encodeURIComponent(cuisine)}&page=${page}`;
            const response = await axios.get(url);
            setRestaurants(response.data.restaurants);
            setFilteredRestaurants(response.data.restaurants);
            setPagination({
                currentPage: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages,
            });
        } catch (err) {
            setError("Error fetching restaurants by cuisine");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination((prevState) => ({ ...prevState, currentPage: newPage }));
        }
    };

    const handleCuisineDetected = (detectedCuisine, detectedFood) => {
        setCuisine(detectedCuisine);
        setDetectedFood(detectedFood); // Set detected food
        setDetectedCuisine(detectedCuisine); // Set detected cuisine
    };

    return (
        <div className="restaurant-list-container">
            <div className="sidebar">
                <h3>Filters</h3>
                <button onClick={() => setShowImagePopup(true)}>Find by Image</button>
                <button onClick={() => setShowLocationPopup(true)}>Find by Location</button>
                
            </div>

            <div className="main-content">
                <div className="top-section">
                    <SearchBar setSearch={setSearch} setRestaurantById={setRestaurantById} />
                </div>

                <div className="body-content">
                    <div className="restaurants-grid">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : restaurantById ? (
                            <RestaurantCard restaurant={restaurantById} />
                        ) : filteredRestaurants.length === 0 ? (
                            <p>No restaurant data available</p>
                        ) : (
                            filteredRestaurants.map((restaurant, index) => (
                                <RestaurantCard key={index} restaurant={restaurant} />
                            ))
                        )}
                    </div>

                    {!restaurantById && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

            {/* Image Popup */}
            {showImagePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-btn" onClick={() => setShowImagePopup(false)}>&times;</span>
                        <h2>Find by Image</h2>
                        <ImageUploader onCuisineDetected={handleCuisineDetected} />
                        {detectedFood && detectedCuisine && (
                            <div className="detected-info">
                                <p><strong>Detected Food:</strong> {detectedFood}</p>
                                <p><strong>Detected Cuisine:</strong> {detectedCuisine}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Location Popup */}
            {showLocationPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-btn" onClick={() => setShowLocationPopup(false)}>&times;</span>
                        <h2>Find by Location</h2>
                        <AddressInput onAddressSelect={(location) => {
                            setSelectedLocation(location);
                            setShowLocationPopup(false);
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantList;
