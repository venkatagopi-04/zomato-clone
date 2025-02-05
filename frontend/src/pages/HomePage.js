import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "./HomePage.css"; // Import CSS

const HomePage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");

    const fetchRestaurants = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `https://restaurant-listing-backend-mvff.onrender.com/api/restaurants?page=${page}&search=${search}`
            );
            setRestaurants(data.restaurants || []); // Fallback to empty array
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Error fetching restaurants", error);
        }
    }, [page, search]); // Adding page and search as dependencies

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]); // Using the memoized fetchRestaurants

    return (
        <div className="container">
            <h1>Restaurant Listing</h1>
            <SearchBar setSearch={setSearch} />
            <div className="restaurant-grid">
                {restaurants && restaurants.length > 0 ? (
                    restaurants.map((r) => (
                        r ? <RestaurantCard key={r._id} restaurant={r} /> : null
                    ))
                ) : (
                    <p>No restaurants found.</p>
                )}
            </div>
            <Pagination page={page} setPage={setPage} total={total} />
        </div>
    );
};

export default HomePage;
