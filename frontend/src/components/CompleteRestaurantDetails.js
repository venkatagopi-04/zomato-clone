import "./CompleteRestaurantDetails.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

const RestaurantDetails = () => {
    const { id } = useParams(); 
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/restaurants/completeDetails/${id}`);
                setRestaurant(response.data);
            } catch (err) {
                setError("Error fetching restaurant details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (restaurant) {
        return (
            <div className="restaurant-details">
                <div className="card shadow-lg p-4 mb-4">
                    <img src={restaurant.featured_image} alt={restaurant.name} className="card-img-top rounded" />
                    <div className="card-body">
                        <h1 className="card-title">{restaurant.name}</h1>
                        <div className="card-text">
                            <p><i className="fas fa-utensils"></i> <strong>Cuisines:</strong> {restaurant.cuisines}</p>
                            <p><i className="fas fa-dollar-sign"></i> <strong>Average cost for two:</strong> {restaurant.average_cost_for_two} {restaurant.currency}</p>
                            <p><i className="fas fa-map-marker-alt"></i> <strong>Location:</strong> {restaurant.location.address}</p>
                            <p><i className="fas fa-star"></i> <strong>Rating:</strong> {restaurant.user_rating.aggregate_rating} ({restaurant.user_rating.votes} votes)</p>
                            <p><i className="fas fa-tags"></i> <strong>Price Range:</strong> {restaurant.price_range}</p>
                        </div>

                        <div>
                            <h3>Offers:</h3>
                            <p>{restaurant.offers.has_table_booking ? "Table booking available" : "No table booking"}</p>
                        </div>

                        <div>
                            <h3>Events:</h3>
                            {restaurant.zomato_events && restaurant.zomato_events.length > 0 ? (
                                restaurant.zomato_events.map((event, index) => (
                                    <div key={index} className="event-details">
                                        <h4>{event.event.title}</h4>
                                        <p>{event.event.description}</p>
                                        <p><strong>Date:</strong> {event.event.display_date}</p>
                                        <p><strong>Time:</strong> {event.event.display_time}</p>
                                        <a href={event.event.share_url} target="_blank" rel="noopener noreferrer" className="btn btn-link">View Event</a>
                                    </div>
                                ))
                            ) : (
                                <p>No events available</p>
                            )}
                        </div>

                        <div>
                            <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Menu</a>
                            <a href={restaurant.deeplink} target="_blank" rel="noopener noreferrer" className="btn btn-success ml-3">Order Now</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default RestaurantDetails;
