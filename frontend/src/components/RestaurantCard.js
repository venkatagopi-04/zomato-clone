import "./RestaurantCard.css";
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="restaurant-card">
        <Link to={`/restaurant/${restaurant.id}`} className="card-link">
            <img src={restaurant.featured_image} alt={restaurant.name} className="restaurant-image" />
            <div className="restaurant-info">
                <h2 className="restaurant-name">
                    {restaurant.name}
                    <div className="name-line"></div>
                </h2>
                <div className="info-row">
                    <div className="info-item">
                        <i className="fa fa-utensils"></i>
                        <span>{restaurant.cuisines}</span>
                    </div>
                    <div className="info-item">
                        <i className="fa fa-map-marker-alt"></i>
                        <span>{restaurant.location}</span>
                    </div>
                    <div className="info-item">
                        <i className="fa fa-dollar-sign"></i>
                        <span>Avg of Two: {restaurant.average_cost_for_two}</span>
                    </div>
                </div>
                <p className="restaurant-rating">
                <i className="fa fa-star"></i>
                    Rating:  ({restaurant.user_rating?.aggregate_rating})
                </p>
            </div>
        </Link>
    </div>
    
    );
};

export default RestaurantCard;
