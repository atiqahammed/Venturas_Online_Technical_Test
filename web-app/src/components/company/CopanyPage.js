import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { post } from "../../util/httpClient";
import { useContext } from "react";
import CompanyList from './CompanyList';

function CopanyPage () {

    const [companyList, setCompanyList] = useState([]);
    const { Id } =
        useContext(AppContext);

    useEffect( () => {
      const requestBody = {
        id: Id
      }
      post('/get-company-list', requestBody).then(response => {
        if(response && response.data && response.data.isSuccess) {
          setCompanyList(response.data.companyList);
        }
      }).catch(error => {
          console.log(error);
      });
    }, []);
  
    return (
      <>
        <div className="jumbotron">
            <h1>Company</h1>
            <Link to="/company" className="btn btn-dark">Add New Company</Link>
        </div>
        <CompanyList companyList={companyList}/>
      </>
    );
  
}

export default CopanyPage;