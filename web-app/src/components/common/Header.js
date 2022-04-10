import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Header() {

	const activeLinkStyle = {color : 'red'};

	const { loggedIn } =
        useContext(AppContext);

  	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				{loggedIn && <>
					<NavLink className="nav-link" to="/profile" activeStyle={activeLinkStyle} exact><h4>Profile</h4></NavLink>
					<NavLink className="nav-link" to="/company-list" activeStyle={activeLinkStyle} exact><h4>Company</h4></NavLink>
					<NavLink className="nav-link" to="/invitation-list" activeStyle={activeLinkStyle} exact><h4>Invitation</h4></NavLink>
				</>}
				
				{!loggedIn && <>
					<NavLink className="nav-link pull-right" to="/registration" activeStyle={activeLinkStyle} exact><h4>Sign Up</h4></NavLink>
				</>}

				<NavLink className="nav-link pull-right" to="/" activeStyle={activeLinkStyle} exact><h4>{loggedIn ? 'Logout': 'Login'}</h4></NavLink>
			</nav>
		</>
  	);
}

export default Header;