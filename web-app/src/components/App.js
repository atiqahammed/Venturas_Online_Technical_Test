import React from "react";
import AboutPage from "./AboutPage";
import Header from "./common/Header";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import BookPage from "./books/BookPage";
import CopanyPage from "./company/CopanyPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageBookPage from "./books/ManageBookPage";
import ManageRegistration from "./user/ManageRegistration";
import CompleteRegistration from "./user/CompleteRegistration";
import Login from "./user/Login";
import Profile from "./user/Profile";
import ManageCompanyPage from "./company/ManageCompanyPage";


function App() {
	return (
		<div className="container-fluid">
			<Header />
			<ToastContainer autoClose={1500} hideProgressBar/>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/profile" exact component={Profile} />
				<Route path="/about" component={AboutPage} />
				<Route path="/company-list" component={CopanyPage} />
				<Route path="/complete-registration"component={CompleteRegistration} />
				<Route path="/books" component={BookPage} />
				<Route path="/book/:id"component={ManageBookPage} />
				<Route path="/company/:id"component={ManageCompanyPage} />
				<Route path="/company"component={ManageCompanyPage} />
				<Route path="/book"component={ManageBookPage} />
				<Route path="/registration"component={ManageRegistration} />
				
				<Route component={PageNotFound}/>
			</Switch>
		</div>
	);
}

export default App;