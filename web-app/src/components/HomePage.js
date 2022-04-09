import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="jumbotron">
      <h1>Home</h1>
      <p>Hi there, This is home page for Author-Book Project.</p>
      <Link to="/about" className="btn btn-dark">Learn more</Link>
    </div>
  );
}

export default HomePage;
