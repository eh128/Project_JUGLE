import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1>Project JUGLE</h1>
      <div className="nav-container">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
      </div>
    </header>
  );
};

export default Header;
