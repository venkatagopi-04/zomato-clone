import "./FoodImage.css";
import React, { useState } from "react";
import axios from "axios";

const cuisineData = {
  "Continental": ["Grilled Chicken", "Roast Beef", "Mashed Potatoes", "Baked Fish", "Garlic Bread", "French Toast"],
  "North Indian": ["Butter Chicken", "Dal Makhani", "Paneer Tikka", "Rogan Josh", "Aloo Paratha", "Chole Bhature"],
  "Italian": ["Pizza", "Pasta", "Lasagna", "Risotto", "Tiramisu", "Bruschetta"],
  "Asian": ["Sushi", "Ramen", "Dumplings", "Kimchi", "Pad Thai", "Pho"],
  "American": ["Burgers", "Hot Dogs", "BBQ Ribs", "Mac and Cheese", "Fried Chicken", "Apple Pie"],
  "Chinese": ["Fried Rice", "Manchurian", "Spring Rolls", "Chow Mein", "Kung Pao Chicken", "Dumplings"],
  "Fine Dining": ["Truffle Risotto", "Foie Gras", "Wagyu Steak", "Caviar", "Lobster Thermidor", "Beef Wellington"],
  "Mexican": ["Tacos", "Burritos", "Nachos", "Quesadillas", "Enchiladas", "Guacamole"],
  "Mediterranean": ["Hummus", "Falafel", "Shawarma", "Greek Salad", "Moussaka", "Baba Ganoush"],
  "Modern Indian": ["Butter Chicken Tacos", "Quinoa Biryani", "Tandoori Broccoli", "Avocado Chaat", "Mango Curry"],
  "Mughlai": ["Biryani", "Shahi Paneer", "Korma", "Kebabs", "Nihari", "Sheermal"],
  "Fast Food": ["French Fries", "Burgers", "Chicken Nuggets", "Hot Dogs", "Sandwiches", "Milkshakes"],
  "South Indian": ["Dosa", "Idli", "Vada", "Uttapam", "Rasam", "Pongal"],
  "European": ["Croissants", "Paella", "Goulash", "Fish and Chips", "Ratatouille", "Beef Stroganoff"]
};

const ImageUploader = ({ onCuisineDetected }) => {
  const [image, setImage] = useState(null);
  const [foodLabel, setFoodLabel] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const findCuisine = (food) => {
    for (const [cuisine, foods] of Object.entries(cuisineData)) {
      if (foods.includes(food)) {
        return cuisine;
      }
    }
    return "Unknown Cuisine";
  };

  const handleSubmit = async () => {
    if (!image) {
      setFoodLabel("Please select an image first.");
      setCuisine("");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/detect-food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const label1 = response.data.label1?.toLowerCase();
      const label2 = response.data.label2?.toLowerCase();

      let detectedFood = "Unknown";

      if (label1 !== "food" && label1) {
        detectedFood = response.data.label1;
      } else if (label2 !== "food" && label2) {
        detectedFood = response.data.label2;
      }

      const detectedCuisine = findCuisine(detectedFood);
      setFoodLabel(detectedFood);
      setCuisine(detectedCuisine);

      // Pass the detected cuisine to the parent component
      if (detectedCuisine !== "Unknown Cuisine") {
        onCuisineDetected(detectedCuisine);
      }

    } catch (err) {
      console.error("Error:", err);
      setFoodLabel("Error detecting food.");
      setCuisine("");
    }
  };

  return (
    <div className="image-uploader-container">
  <label htmlFor="file-upload" className="upload-label">Choose Image</label>
  <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
  <button className="upload-button" onClick={handleSubmit}>Detect Food</button>

  {foodLabel && (
    <div className="result-container">
      <p className="detected-food"><strong>Detected Food:</strong> {foodLabel}</p>
      <p className="detected-cuisine"><strong>Cuisine:</strong> {cuisine}</p>
    </div>
  )}
</div>
  );
};

export default ImageUploader;
