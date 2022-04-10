import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { post } from "../../util/httpClient";
import { useContext } from "react";
import EmployeeList from "./EmployeeList";

function EmployeePage () {

    const [employeeList, setEmployeeList] = useState([]);
    const { Id } =
        useContext(AppContext);

    useEffect( () => {
      const requestBody = {
        id: Id
      }
      post('/get-employee-list', requestBody).then(response => {
        if(response && response.data && response.data.isSuccess) {
          console.log(response.data.employeeList)
          setEmployeeList(response.data.employeeList);
        }
      }).catch(error => {
          console.log(error);
      });
    }, []);
  
    return (
      <>
        <div className="jumbotron">
            <h1>Employees</h1>
            <Link to="/invitation" className="btn btn-dark">Add New Employee</Link>
        </div>
        <EmployeeList employeeList={employeeList}/>
      </>
    );
  
}

export default EmployeePage;