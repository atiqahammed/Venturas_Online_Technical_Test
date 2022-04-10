import React from "react";
import { Link } from "react-router-dom";

function CompanyList (props) {
    return (
      <>
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
                {props.companyList.map((company) =>{
                    return (
                        <tr key={company.Id}>
                            <td><Link to={"/company/" + company.Id}>{company.Name}</Link></td>
                            <td>{company.Id}</td>
                            <td>{company.Email}</td>
                            <td>{company.Address}</td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </>
    );
}

export default CompanyList;