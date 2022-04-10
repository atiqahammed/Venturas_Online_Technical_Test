import React, { useState } from "react";
import TextInput from "../common/TextInput";

function CompleteRegistration(props) {

  const query = new URLSearchParams(props.location.search);
  const token = query.get('token');

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    name: '',
    zipCode: '',
    address: '',
    phoneNumber: '',
    department: '',
    password: '',
    temporaryPassword: '',
    regards: '',
    dateOfBirth: ''
  });

  function handleChange({target}) {
    setUser({
      ...user, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.name) _errors.name = "Name is required";
    if (!user.zipCode) _errors.zipCode = "Zip Code is required";
    if (!user.address) _errors.address = "Address is required";
    if (!user.phoneNumber) _errors.phoneNumber = "Phone Number is required";
    if (!user.department) _errors.department = "Department is required";
    if (!user.password) _errors.password = "Password is required";
    if (!user.temporaryPassword) _errors.temporaryPassword = "Temporary Password is required";
    if (!user.regards) _errors.regards = "Regards is required";
    if (!user.dateOfBirth) _errors.dateOfBirth = "Date Of Birth is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('here');
    const isInvalid = formIsValid();
    console.log(isInvalid);
    if (!formIsValid()) return;

    console.log(user)

    // const requestBody = {
    //   email: user.email,
    //   invitedBy: 0,
    //   companyId: 0,
    //   userType: USER_TYPE.SYSTEM_ADMIN
    // }
    // post('/invite-user', requestBody).then(response => {
    //   console.log(response);
    //   if(response && response.data && response.data.isSuccess) {
    //     toast("Please check your email to complete registration.");
    //     setUser({
    //       email: ''
    //     });
    //   } else {
    //     toast("Something went wrong. Please check again.");
    //   }
    // }).catch(error => {
    //     console.log(error);
    // });
  }

  return (
    <>
    <div className="jumbotron">
      <h1>Complete User Registration</h1>
    </div>
    <div className="container">
      <form onSubmit={handleSubmit}>

        <TextInput
          id="name"
          label="Name"
          name="name"
          onChange={handleChange}
          value={user.name}
          error={errors.name}
        />

        <TextInput
          id="address"
          label="Address"
          name="address"
          onChange={handleChange}
          value={user.address}
          error={errors.address}
        />

        <TextInput
          id="zipCode"
          label="Zip Code"
          name="zipCode"
          onChange={handleChange}
          value={user.zipCode}
          error={errors.zipCode}
        />

        <TextInput
          id="phoneNumber"
          label="Phone Number"
          name="phoneNumber"
          onChange={handleChange}
          value={user.phoneNumber}
          error={errors.phoneNumber}
        />

        <TextInput
          id="department"
          label="Department"
          name="department"
          onChange={handleChange}
          value={user.department}
          error={errors.department}
        />

        <TextInput
          id="dateOfBirth"
          label="Date Of Birth"
          name="dateOfBirth"
          onChange={handleChange}
          value={user.dateOfBirth}
          error={errors.dateOfBirth}
        />

        <TextInput
          id="regards"
          label="Regards"
          name="regards"
          onChange={handleChange}
          value={user.regards}
          error={errors.regards}
        />

        <TextInput
          id="password"
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          value={user.password}
          error={errors.password}
        />

        <TextInput
          id="temporaryPassword"
          label="Temporary Password"
          name="temporaryPassword"
          type="password"
          onChange={handleChange}
          value={user.temporaryPassword}
          error={errors.temporaryPassword}
        />

        <input type="submit" value="Save" className="btn btn-dark" /> {"   "}
      </form>
    </div>
    </>
  );
}

export default CompleteRegistration;