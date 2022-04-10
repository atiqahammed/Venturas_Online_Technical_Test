import React from "react";

function EmployeeList (props) {
    return (
      <>
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>User Type</th>
              </tr>
            </thead>
            <tbody>
                {props.employeeList.map((employee) =>{
                    return (
                        <tr key={employee.Id}>
                            <td>{employee.Id}</td>
                            <td>{employee.Email}</td>
                            <td>{employee.UserType}</td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </>
    );
}

export default EmployeeList;