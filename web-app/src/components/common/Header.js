import React from "react";
import { NavLink } from "react-router-dom";

function Header() {

	const activeLinkStyle = {color : 'red'};

  	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<NavLink className="nav-link" to="/" activeStyle={activeLinkStyle} exact><h4>Home</h4></NavLink>
				<NavLink className="nav-link" to="/authors" activeStyle={activeLinkStyle} exact><h4>Authors</h4></NavLink>
                <NavLink className="nav-link" to="/books" activeStyle={activeLinkStyle} exact><h4>Books</h4></NavLink>
				<NavLink className="nav-link" to="/about" activeStyle={activeLinkStyle} exact><h4>About</h4></NavLink>
			</nav>
		</>
  	);
}

export default Header;