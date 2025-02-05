import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ setSearch, setRestaurantById }) => {
    const [idInput, setIdInput] = useState("");

    // Handle restaurant ID search
    const handleIdSearch = async () => {
        const numericId = parseInt(idInput);  // Convert the input to a number

        if (!idInput || isNaN(numericId)) {
            alert("Please enter a valid numeric restaurant ID");
            return;
        }
    
        try {
            const response = await fetch(`https://restaurant-listing-backend-mvff.onrender.com/api/restaurants/restaurant/${numericId}`);
            const data = await response.json();
            console.log(data);
            if (data.error) {
                alert("Restaurant not found");
            } else {
                setRestaurantById(data);  // Update state with the restaurant data
            }
        } catch (error) {
            console.error("Error fetching restaurant by ID:", error);
            alert("An error occurred while searching for the restaurant.");
        }
    };

    return (
        <div className="search-container">
        <input
            id="first-box"
            type="text"
            className="search-input"
            placeholder="Search restaurant by name..."
            onChange={(e) => setSearch(e.target.value)}
        />
        
        <input
            
            type="text"
            className="id-search-input"
            placeholder="Enter restaurant ID..."
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
        />
        
        <button className="search-button" onClick={handleIdSearch}>
            Search by ID
        </button>
    </div>
    
    );
};

export default SearchBar;
