import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CopanyPage () {

    const [books, setBooks] = useState([]);

    useEffect( () => {
        // getBooks().then((_books) => {
        //     setBooks(_books);
        // });
    }, []);
  
    return (
      <>
        <div className="jumbotron">
            <h1>Company</h1>
            <Link to="/company" className="btn btn-dark">Add New Company</Link>
        </div>
        {/* <BookList books={books}/> */}
      </>
    );
  
}

export default CopanyPage;