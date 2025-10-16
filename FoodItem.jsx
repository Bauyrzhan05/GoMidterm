import React from "react";
import { assets } from "../assets/frontend_assets/assets";

export default function FoodItem({ id, name, price, description, image }) {
    return (
    <div className="food-gallery">
        <div className="food-card">
            <div className="card-image-container">
            <img 
                className="food-image" 
                src={`http://localhost:8080/${image}`} 
                alt={name}
            />
            <div className="image-overlay"></div>
            
            
        <div className="cart-controls">
            <button className="add-button">
                <img src={assets.add_icon_white} alt="Add to cart" />
            </button>
        </div>
      
        </div>
            <div className="card-body">
                <div className="card-header">
                    <h3 className="food-name">{name}</h3>
                    <div className="rating">
                    <img src={assets.rating_starts} alt="Rating" />
                    </div>
                </div>
                
                <p className="food-description">{description}</p>
                
                <div className="price-container">
                    <span className="price">${price}</span>
                    <div className="price-underline"></div>
                </div>
            </div>
        </div>
    </div>         
    );
}

