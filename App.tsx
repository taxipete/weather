import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Review from "./pages/Review";
import Time from "./pages/Time";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={<Review />} />
        <Route path="/time" element={<Time />} />
      </Routes>
    </Router>
  );
};

export default App;
