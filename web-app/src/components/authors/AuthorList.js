import React from "react";
import { Link } from "react-router-dom";

function AuthorList (props) {
    return (
      <>
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th>Firt Name</th>
                <th>Last Name</th>
                <th>ID</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
                {props.authors.map((author) =>{
                    return (
                        <tr key={author.id}>
                            <td><Link to={"/author/" + author.id}>{author.firstName}</Link></td>
                            <td>{author.lastName}</td>
                            <td>{author.id}</td>
                            <td>{author.gender}</td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </>
    );
}

export default AuthorList;