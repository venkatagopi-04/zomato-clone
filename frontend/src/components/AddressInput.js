import "./AddressInput.css";
import React, { useEffect } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

const AddressInput = ({ onAddressSelect }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300, // Delay input to reduce unnecessary API calls
        cache: 24 * 60 * 60 * 1000, // Cache results for 24 hours
    });

    useEffect(() => {
        // Ensure Google Maps API is loaded before trying to use geocoding
        if (typeof window.google === "undefined") {
            console.error("Google Maps API not loaded");
        }
    }, []);

    const handleSelect = async (address) => {
        setValue(address, false);  // Set the address value
        clearSuggestions();        // Clear the suggestions list

        try {
            // Access Google Maps Geocoder
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    // Get latitude and longitude from the first geocode result
                    const location = results[0].geometry.location;
                    const latitude = location.lat();
                    const longitude = location.lng();

                    // Passing selected lat/lng to parent component
                    onAddressSelect({ latitude, longitude });

                } else {
                    console.error("Geocode failed: ", status);
                }
            });
        } catch (error) {
            console.error("Error retrieving geocode: ", error);
        }
    };

    return (
        <div className="address-input-container">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}  // Update value on user input
                disabled={!ready}  // Disable input until the API is ready
                placeholder="Search for a location"
            />
            <ul className="address-suggestions">
                {status === "OK" &&
                    data.length > 0 &&
                    data.map(({ place_id, description }) => (
                        <li key={place_id} onClick={() => handleSelect(description)}>
                            {description}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default AddressInput;
