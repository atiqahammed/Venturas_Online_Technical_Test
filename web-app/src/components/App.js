import React from "react";
import AboutPage from "./AboutPage";
import Header from "./common/Header";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import AuthorPage from "./authors/AuthorPage";
import ManageAuthorPage from "./authors/ManageAuthorPage"
import BookPage from "./books/BookPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageBookPage from "./books/ManageBookPage";
import ManageRegistration from "./user/ManageRegistration";
import CompleteRegistration from "./user/CompleteRegistration";
import Login from "./user/Login";


function App() {
	return (
		<div className="container-fluid">
			<Header />
			<ToastContainer autoClose={1500} hideProgressBar/>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/about" component={AboutPage} />
				<Route path="/authors" component={AuthorPage} />
				<Route path="/complete-registration"component={CompleteRegistration} />
				<Route path="/books" component={BookPage} />
				<Route path="/author/:id"component={ManageAuthorPage} />
				<Route path="/author"component={ManageAuthorPage} />
				<Route path="/book/:id"component={ManageBookPage} />
				<Route path="/book"component={ManageBookPage} />
				<Route path="/registration"component={ManageRegistration} />
				
				<Route component={PageNotFound}/>
			</Switch>
		</div>
	);
}

export default App;