import React from "react";
import { Link } from "react-router-dom";

function BookList (props) {
    return (
      <>
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Categoty</th>
              </tr>
            </thead>
            <tbody>
                {props.books.map((book) =>{
                    return (
                        <tr key={book.id}>
                            <td><Link to={"/book/" + book.id}>{book.name}</Link></td>
                            <td>{book.id}</td>
                            <td>{book.category}</td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </>
    );
}

export default BookList;