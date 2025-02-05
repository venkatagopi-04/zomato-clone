import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Import router components
import RestaurantList from "./components/RestaurantList";
import CompleteRestaurantDetails from "./components/CompleteRestaurantDetails";  // Make sure to import the details component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RestaurantList />} />  {/* Main list route */}
          <Route path="/restaurant/:id" element={<CompleteRestaurantDetails />} />  {/* Route for the restaurant details */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
