import React, { useState } from "react";
import { toast } from "react-toastify";
import RegistrationForm from "./RegistrationForm";
import { post } from "./../../util/httpClient";
import { USER_TYPE } from "./../../util/const";

function ManageRegistration() {

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: ''
  });

  function handleChange({target}) {
    setUser({
      ...user, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.email) _errors.email = "Email is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    const requestBody = {
      email: user.email,
      invitedBy: 0,
      companyId: 0,
      userType: USER_TYPE.SYSTEM_ADMIN
    }
    post('/invite-user', requestBody).then(response => {
      console.log(response);
      if(response && response.data && response.data.isSuccess) {
        toast("Please check your email to complete registration.");
        setUser({
          email: ''
        });
      } else {
        toast("Something went wrong. Please check again.");
      }
    }).catch(error => {
        console.log(error);
    });
  }

  return (
    <>
    <div className="jumbotron">
      <h1>New System Administrator Registration</h1>
    </div>
    <div className="container">
      <RegistrationForm user={user} errors={errors} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
    </>
  );
}

export default ManageRegistration;