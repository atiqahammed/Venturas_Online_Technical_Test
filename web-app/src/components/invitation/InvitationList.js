import React from "react";
import { Link } from "react-router-dom";

function InvitationList (props) {
    return (
      <>
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Status</th>
                <th>User Type</th>
              </tr>
            </thead>
            <tbody>
                {props.invitationList.map((invitation) =>{
                    return (
                        <tr key={invitation.Id}>
                            <td>{invitation.Id}</td>
                            <td>{invitation.Email}</td>
                            <td>{invitation.Status}</td>
                            <td>{invitation.UserType}</td>
                        </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
      </>
    );
}

export default InvitationList;