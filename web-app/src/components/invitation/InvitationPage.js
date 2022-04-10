import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { post } from "../../util/httpClient";
import { useContext } from "react";
import InvitationList from './InvitationList';

function InvitationPage () {

    const [invitationList, setInvitationList] = useState([]);
    const { Id } =
        useContext(AppContext);

    useEffect( () => {
      const requestBody = {
        id: Id
      }
      post('/get-invitation-list', requestBody).then(response => {
        if(response && response.data && response.data.isSuccess) {
          setInvitationList(response.data.invitationList);
        }
      }).catch(error => {
          console.log(error);
      });
    }, []);
  
    return (
      <>
        <div className="jumbotron">
            <h1>Invitation</h1>
            <Link to="/invitation" className="btn btn-dark">Add New Invitation</Link>
        </div>
        <InvitationList invitationList={invitationList}/>
      </>
    );
  
}

export default InvitationPage;