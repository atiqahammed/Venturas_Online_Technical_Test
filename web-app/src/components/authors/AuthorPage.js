import React, { useState, useEffect } from "react";
// import { getAuthors } from "../../api/authorApi";
import AuthorList from "./AuthorList";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadAuthors } from "../../redux/actions/authorActions"

function AuthorPage (props) {

    // const [authors, setAuthors] = useState([]);

    useEffect(() => {
      props.loadAuthors();   
    }, []);
  
    return (
      <>
        <div className="jumbotron">
            <h1>Authors</h1>
          <Link to="/author" className="btn btn-dark">Add New Author</Link>
        </div>
        <AuthorList authors={props.authors}/>
      </>
    );
  
}

function mapStateToProps(state) {
  return {
    authors: state.authors
  }
}

const mapDispatchToProps = {
  loadAuthors
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorPage);