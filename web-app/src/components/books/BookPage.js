import React, { useState, useEffect } from "react";
import { getBooks } from "../../api/bookApi";
import BookList from "./BookList";
import { Link } from "react-router-dom";

function BookPage () {

    const [books, setBooks] = useState([]);

    useEffect( () => {
        getBooks().then((_books) => {
            setBooks(_books);
        });
    }, []);
  
    return (
      <>
        <div className="jumbotron">
            <h1>Books</h1>
            <Link to="/book" className="btn btn-dark">Add New Book</Link>
        </div>
        <BookList books={books}/>
      </>
    );
  
}

export default BookPage;